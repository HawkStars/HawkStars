import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { HandleDelete, HandleUpload } from '@payloadcms/plugin-cloud-storage/types';

type UploadResult = { public_id: string; existing?: boolean; bytes: number };

const uploadResults: Array<UploadResult | Error> = [];
const uploadedPublicIds: string[] = [];

const uploader = {
  upload_stream: vi.fn(
    (options: { public_id: string }, callback: (error?: Error, result?: UploadResult) => void) => {
      uploadedPublicIds.push(options.public_id);
      const next = uploadResults.shift() ?? { public_id: options.public_id, bytes: 5 };
      return {
        end: () => (next instanceof Error ? callback(next) : callback(undefined, next)),
      };
    }
  ),
  destroy: vi.fn(),
};

vi.mock('cloudinary', () => ({ v2: { config: vi.fn(), uploader } }));
vi.mock('@/lib/sentry/cli-client', () => ({ captureException: vi.fn() }));

const { cloudinaryAdapter, toCloudinaryPublicId } = await import('./adapter');

const uploadArgs = (filename: string) =>
  ({
    file: { buffer: Buffer.from('hello'), filename, filesize: 5, mimeType: 'image/png' },
  }) as unknown as Parameters<HandleUpload>[0];

const find = vi.fn();
const deleteArgs = (filename: string) =>
  ({
    filename,
    doc: { id: 'doc-1' },
    collection: { slug: 'media' },
    req: { payload: { find } },
  }) as unknown as Parameters<HandleDelete>[0];

beforeEach(() => {
  vi.clearAllMocks();
  uploadResults.length = 0;
  uploadedPublicIds.length = 0;
  find.mockResolvedValue({ docs: [] });
  uploader.destroy.mockResolvedValue({ result: 'ok' });
});

describe('toCloudinaryPublicId', () => {
  it('drops the extension and prefixes the media folder', () => {
    expect(toCloudinaryPublicId('photo.png')).toBe('media/photo');
    expect(toCloudinaryPublicId('my.photo.jpg')).toBe('media/my.photo');
  });
});

describe('handleUpload', () => {
  it('compresses on upload and writes nothing back when the name is free', async () => {
    const result = await cloudinaryAdapter().handleUpload(uploadArgs('photo.png'));

    expect(result).toEqual({});
    expect(uploadedPublicIds).toEqual(['media/photo']);
    const options = uploader.upload_stream.mock.calls[0][0] as Record<string, unknown>;
    expect(options).toMatchObject({
      overwrite: false,
      resource_type: 'image',
      transformation: [{ width: 2560, crop: 'limit', fetch_format: 'auto', quality: 'auto' }],
    });
  });

  it('renames on a public ID collision and returns the new filename', async () => {
    uploadResults.push({ public_id: 'media/photo', existing: true, bytes: 9 });

    const result = await cloudinaryAdapter().handleUpload(uploadArgs('photo.jpg'));

    expect(uploadedPublicIds).toEqual(['media/photo', 'media/photo-jpg']);
    expect(result).toEqual({ filename: 'photo-jpg.jpg' });
  });

  it('keeps renaming while the new name is also taken', async () => {
    uploadResults.push(
      { public_id: 'media/photo', existing: true, bytes: 9 },
      { public_id: 'media/photo-jpg', existing: true, bytes: 9 }
    );

    const result = await cloudinaryAdapter().handleUpload(uploadArgs('photo.jpg'));
    expect(uploadedPublicIds.at(-1)).toBe('media/photo-jpg-2');
    expect(result).toEqual({ filename: 'photo-jpg-2.jpg' });
  });

  it('rethrows upload errors', async () => {
    uploadResults.push(new Error('quota'));
    await expect(cloudinaryAdapter().handleUpload(uploadArgs('photo.png'))).rejects.toThrow(
      'quota'
    );
  });
});

describe('handleDelete', () => {
  it('destroys the asset and invalidates the CDN', async () => {
    await cloudinaryAdapter().handleDelete(deleteArgs('photo.png'));
    expect(uploader.destroy).toHaveBeenCalledWith('media/photo', {
      resource_type: 'image',
      invalidate: true,
    });
  });

  it('keeps an asset another document still points at', async () => {
    find.mockResolvedValue({ docs: [{ filename: 'photo.jpg' }, { filename: 'photo-1.png' }] });
    await cloudinaryAdapter().handleDelete(deleteArgs('photo.png'));
    expect(uploader.destroy).not.toHaveBeenCalled();
  });

  it('deletes when only similarly named documents exist', async () => {
    find.mockResolvedValue({ docs: [{ filename: 'photo-1.png' }] });
    await cloudinaryAdapter().handleDelete(deleteArgs('photo.png'));
    expect(uploader.destroy).toHaveBeenCalled();
  });
});
