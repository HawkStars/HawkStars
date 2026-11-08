import type { HandleUpload, HandleDelete } from '@payloadcms/plugin-cloud-storage/types';
import type { UploadApiResponse } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { captureException } from '@/lib/sentry/cli-client';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MEDIA_FOLDER = 'media';
const MAX_RENAME_ATTEMPTS = 5;

const stripExtension = (filename: string) => filename.replace(/\.[^/.]+$/, '');
const getExtension = (filename: string) => /\.([^/.]+)$/.exec(filename)?.[1] ?? '';

/**
 * Cloudinary public ID for a stored Payload filename: `photo.png` → `media/photo`.
 *
 * Must stay in step with `generateFileURL` in `payload/plugins/index.ts`, which builds
 * `media/<filename>` — Cloudinary reads the trailing extension as the delivery format, so
 * that URL resolves to this public ID.
 */
export const toCloudinaryPublicId = (filename: string) =>
  `${MEDIA_FOLDER}/${stripExtension(filename)}`;

/**
 * Filename to retry with when the public ID is already taken: `photo.jpg` → `photo-jpg.jpg`,
 * then `photo-jpg-2.jpg`, … The extension stays last so the delivery URL keeps working.
 */
const renameForCollision = (filename: string, attempt: number) => {
  const extension = getExtension(filename);
  const suffix = `${extension || 'file'}${attempt > 1 ? `-${attempt}` : ''}`;
  return `${stripExtension(filename)}-${suffix}${extension ? `.${extension}` : ''}`;
};

function uploadBuffer(buffer: Buffer, publicId: string): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        // Media accepts raster images only, and both the delivery URL and `destroy` default to
        // the image resource type — keep uploads on the same type so all three agree.
        resource_type: 'image',
        public_id: publicId,
        // Never replace an existing asset: another document may be using it. A taken public ID
        // comes back with `existing: true` instead, and the caller picks a new name.
        overwrite: false,
        // Incoming transformation: recompresses the stored original to save Cloudinary storage
        // (the account is space-limited). This is deliberate — it is lossy and permanent, and
        // next/image compresses again on delivery, but the space saving is worth it here.
        // `crop: 'limit'` only shrinks images wider than 2560px (never upscales); the largest
        // size next/image requests is 2048px (`deviceSizes` in next.config.ts).
        transformation: [{ width: 2560, crop: 'limit', fetch_format: 'auto', quality: 'auto' }],
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('No result returned from Cloudinary'));
        resolve(result);
      }
    );
    // The whole file is already in memory; send it in one go.
    uploadStream.end(buffer);
  });
}

export const cloudinaryAdapter = () => ({
  name: 'cloudinary-adapter',

  /**
   * Runs in the cloud-storage plugin's `afterChange` hook, after Payload has saved the
   * document. Only the returned object is persisted, so a changed filename must be returned
   * rather than assigned onto `file`.
   *
   * Payload keeps filenames unique including the extension, but the public ID drops it — so
   * `photo.png` and `photo.jpg` would both map to `media/photo`. With `overwrite: false`
   * Cloudinary would hand back the existing asset and the second document would silently show
   * the first image. On a collision we upload under a new name and return it.
   */
  async handleUpload({ file }: Parameters<HandleUpload>[0]) {
    try {
      const buffer = file.buffer instanceof Buffer ? file.buffer : Buffer.from(file.buffer);

      let filename = file.filename;
      let result = await uploadBuffer(buffer, toCloudinaryPublicId(filename));

      for (let attempt = 1; result.existing === true; attempt++) {
        if (attempt > MAX_RENAME_ATTEMPTS) {
          throw new Error(
            `Cloudinary public ID for "${file.filename}" is taken after ${MAX_RENAME_ATTEMPTS} renames`
          );
        }
        filename = renameForCollision(file.filename, attempt);
        result = await uploadBuffer(buffer, toCloudinaryPublicId(filename));
      }

      // An empty object writes nothing back (the plugin skips its second update when there is
      // no metadata), which is what we want when the original name was free.
      return filename === file.filename ? {} : { filename };
    } catch (error) {
      captureException(error, { extra: { filename: file.filename } });
      // Rethrow so the request fails instead of leaving a document that points at nothing.
      throw error;
    }
  },

  async handleDelete({ filename, doc, req, collection }: Parameters<HandleDelete>[0]) {
    const publicId = toCloudinaryPublicId(filename);

    try {
      // Documents saved before collisions were handled can share one asset (`photo.png` and
      // `photo.jpg` → `media/photo`). Deleting it would break the image on the other document.
      const base = stripExtension(filename);
      const others = await req.payload.find({
        collection: collection.slug as 'media',
        where: { and: [{ id: { not_equals: doc.id } }, { filename: { like: base } }] },
        select: { filename: true },
        depth: 0,
        pagination: false,
        req,
      });
      const stillUsed = others.docs.some((other) => {
        const otherFilename = (other as { filename?: string | null }).filename;
        return otherFilename ? toCloudinaryPublicId(otherFilename) === publicId : false;
      });
      if (stillUsed) return;

      // `invalidate` purges the CDN copies too; without it a deleted image keeps being served
      // from cache for weeks, and a re-upload under the same name can show the old picture.
      const response: { result?: string } = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'image',
        invalidate: true,
      });
      if (response?.result !== 'ok' && response?.result !== 'not found') {
        throw new Error(`Cloudinary destroy returned "${response?.result ?? 'no result'}"`);
      }
    } catch (error) {
      // The Payload document is deleted regardless; the asset is left behind as an orphan.
      captureException(error, {
        extra: { publicId, note: 'Cloudinary asset was not deleted. Remove it manually.' },
      });
    }
  },

  staticHandler() {
    return new Response('Not implemented', { status: 501 });
  },
});
