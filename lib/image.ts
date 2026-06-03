import { ImageType, Media } from '@/payload-types';

/**
 * Shared neutral blur placeholder (1x1 neutral-200 #e5e5e5 PNG). Fallback for
 * `next/image`'s `placeholder="blur"` + `blurDataURL` when a Cloudinary-derived
 * LQIP can't be produced (e.g. external/non-Cloudinary images).
 */
export const BLUR_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mPk5+evBwACagF/lpVtdgAAAABJRU5ErkJggg==';

/**
 * Build a tiny, heavily-blurred Cloudinary variant of an image URL, suitable
 * for use as a `next/image` `blurDataURL`. Cloudinary generates the LQIP on the
 * fly via URL transformations, so no extra request/processing is needed on our
 * side — the blurred image is just a different transformation of the same asset.
 *
 * Returns the shared neutral placeholder for non-Cloudinary URLs.
 */
export const getCloudinaryBlurURL = (url?: string): string => {
  if (!url) return BLUR_DATA_URL;

  // Only Cloudinary delivery URLs have an `/upload/` segment we can transform.
  const marker = '/upload/';
  const idx = url.indexOf(marker);
  if (!url.includes('res.cloudinary.com') || idx === -1) return BLUR_DATA_URL;

  const transform = 'e_blur:1000,q_1,w_64,f_auto';
  const before = url.slice(0, idx + marker.length);
  const after = url.slice(idx + marker.length);
  return `${before}${transform}/${after}`;
};

const getImagePayloadUrl = (info?: ImageType) => {
  if (!info) return undefined;
  if (info.imageType === 'external') return { url: info.externalImage || '', alt: info.alt || '' };
  if (typeof info.image === 'string') return { url: info.image, alt: info.alt || '' };

  const imageInfo = info.image as Media;
  if (!imageInfo) return undefined;

  return {
    url: imageInfo?.url || '',
    alt: info.alt || imageInfo.alt || '',
    width: imageInfo.width,
    height: imageInfo.height,
  };
};

export { getImagePayloadUrl };
