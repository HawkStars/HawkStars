import type { ImageProps, StaticImageData } from 'next/image';
import type { ElementType, Ref } from 'react';

import type { ImageType, Media as MediaType } from '@/payload-types';

/**
 * A media resource accepted by the `Media` / `ImageMedia` / `VideoMedia`
 * components. Can be:
 * - an `ImageType` field (Payload block field with external/upload/none logic)
 * - a populated `Media` document
 * - a raw URL string
 * - a numeric id (unpopulated relation — renders nothing)
 */
export type MediaResource = ImageType | MediaType | string | number | null;

export type NextImageProps = Omit<ImageProps, 'src' | 'resource'> &
  Partial<Pick<ImageProps, 'src'>> & {
    pictureClassName?: string;
    imageClassName?: string;
    resource?: MediaResource;
  };
