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

export type CustomImageProps = {
  url?: string;
  alt?: string;
  width?: number | null;
  height?: number | null;
};

const getImagePayloadUrl = (info?: ImageType): CustomImageProps | undefined => {
  if (!info) return undefined;
  if (info.imageType === 'external' && info.externalImage)
    return { url: info.externalImage, alt: info.alt ?? undefined };
  if (typeof info.image === 'string')
    return { url: info.image ?? undefined, alt: info.alt ?? undefined };

  const imageInfo = info.image as Media;
  if (!imageInfo) return undefined;

  return {
    url: imageInfo?.url ?? undefined,
    alt: info.alt ?? imageInfo.alt ?? undefined,
    width: imageInfo.width ?? undefined,
    height: imageInfo.height ?? undefined,
  };
};

const isImageType = (obj: unknown): obj is ImageType => {
  return (
    !!obj &&
    typeof obj === 'object' &&
    ('imageType' in obj || 'externalImage' in obj || 'image' in obj)
  );
};

const createOGImageUrl = (
  image?: ImageType | Media | string | null
): CustomImageProps | undefined => {
  if (isImageType(image)) return getImagePayloadUrl(image);
  if (typeof image === 'string') return { url: image, alt: undefined };

  if (image && typeof image === 'object' && 'url' in image && image.url) {
    return {
      url: image.url,
      alt: image.alt ?? undefined,
      width: image.width ?? undefined,
      height: image.height ?? undefined,
    };
  }

  return undefined;
};

export { getImagePayloadUrl, createOGImageUrl };
