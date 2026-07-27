import type { ImageType, Media as MediaType } from '@/payload-types';

import type { MediaResource } from './types';

import { getImagePayloadUrl } from '@/lib/image';
import { getMediaUrl } from '@/payload/utilities/getMediaUrl';

export interface ResolvedMedia {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  /** True when the underlying Media document is a video (`mimeType` `video/*`). */
  isVideo: boolean;
}

/**
 * An `ImageType` field is distinguished from a populated `Media` document by
 * its discriminator keys (`imageType` / `externalImage` / `image`). A `Media`
 * document never carries those keys.
 */
const isImageType = (resource: object): resource is ImageType =>
  'imageType' in resource || 'externalImage' in resource || 'image' in resource;

const isVideoMedia = (resource: object): resource is MediaType =>
  'mimeType' in resource &&
  typeof (resource as MediaType).mimeType === 'string' &&
  (resource as MediaType).mimeType!.startsWith('video/');

/**
 * Normalize any accepted media resource into a common shape the media
 * components can render, applying the same URL resolution used across the app
 * (`getImagePayloadUrl` for `ImageType`, `getMediaUrl` for base-URL prefixing).
 *
 * Returns `undefined` when there is nothing renderable (null, unpopulated
 * numeric relation, or an empty URL).
 */
export const resolveMedia = (resource?: MediaResource): ResolvedMedia | undefined => {
  if (resource === null || resource === undefined) return undefined;

  // Numeric id = unpopulated relation, nothing to render.
  if (typeof resource === 'number') return undefined;

  // Raw URL string.
  if (typeof resource === 'string') {
    const url = getMediaUrl(resource);
    return url ? { url, alt: '', isVideo: false } : undefined;
  }

  // `ImageType` block field.
  if (isImageType(resource)) {
    const info = getImagePayloadUrl(resource);
    if (!info || !info.url) return undefined;
    return {
      url: getMediaUrl(info.url),
      alt: info.alt || '',
      width: info.width ?? undefined,
      height: info.height ?? undefined,
      isVideo: false,
    };
  }

  // Populated `Media` document.
  const media = resource as MediaType;
  const url = getMediaUrl(media.url, media.updatedAt);
  if (!url) return undefined;

  return {
    url,
    alt: media.alt || '',
    width: media.width ?? undefined,
    height: media.height ?? undefined,
    isVideo: isVideoMedia(media),
  };
};

/** Cheap check for the dispatcher — is this resource a video Media document? */
export const isVideoResource = (resource?: MediaResource): boolean =>
  !!resource && typeof resource === 'object' && isVideoMedia(resource);
