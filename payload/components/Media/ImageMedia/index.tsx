import type { StaticImageData } from 'next/image';
import NextImage from 'next/image';
import React from 'react';

import { resolveMedia } from '../resolve';
import { getCloudinaryBlurURL } from '@/lib/image';
import { cn } from '@/lib/utils';
import { NextImageProps } from '../types';

/**
 * The single source of truth for rendering images. Replaces every direct
 * `next/image` `<Image>` and raw `<img>` usage in the app. Accepts:
 * - `src`: a static import (`StaticImageData`) or a raw URL string
 * - `resource`: a populated `Media` document or an `ImageType` block field
 *
 * URL resolution mirrors the app helpers (`getImagePayloadUrl` + `getMediaUrl`)
 * and the LQIP blur is derived from Cloudinary when possible. Pass
 * `unoptimized` for arbitrary external URLs not covered by `next.config.ts`
 * `remotePatterns`. The `<picture>` wrapper is only emitted when
 * `pictureClassName` is provided, so layout matches a bare `<img>` otherwise.
 */

export const ImageMedia: React.FC<NextImageProps> = (props) => {
  const {
    className,
    draggable,
    fill: fillFromProps,
    pictureClassName,
    preload,
    quality,
    resource,
    sizes,
    src: srcFromProps,
    loading: loadingFromProps,
    unoptimized,
    onClick,
    onLoad,
  } = props;

  let { width, height, alt } = props;

  let src = srcFromProps;
  const isStringSrc = typeof src === 'string' || src === undefined;

  if (isStringSrc && !src && resource) {
    const resolved = resolveMedia(resource);
    if (!resolved) return null;
    src = resolved.url;
    width = width ?? resolved.width;
    height = height ?? resolved.height;
    alt = alt ?? resolved.alt;
  }

  if (isStringSrc && !src) return null;

  // A `StaticImageData` src carries its own intrinsic width/height (and supports
  // width-only aspect scaling), so it should never be forced into `fill`. Only
  // fall back to `fill` for string/resource URLs whose dimensions are unknown.
  const isStatic = typeof src === 'object' && src !== null;
  const useFill = fillFromProps ?? (isStatic ? false : width === undefined && height === undefined);

  const loading = loadingFromProps || (!preload ? 'lazy' : undefined);

  // For string URLs we derive a Cloudinary LQIP; static raster imports carry
  // their own generated `blurDataURL`; SVGs (and anything without a blur) must
  // use `placeholder="empty"` or next/image throws at runtime.
  const urlBlur = typeof src === 'string' ? getCloudinaryBlurURL(src) : undefined;
  const staticBlur = isStatic ? (src as StaticImageData).blurDataURL : undefined;
  const placeholder = urlBlur || staticBlur ? 'blur' : 'empty';

  const image = (
    <NextImage
      alt={alt}
      className={cn(className)}
      draggable={draggable}
      fill={useFill}
      width={!useFill ? width : undefined}
      height={!useFill ? height : undefined}
      placeholder={placeholder}
      blurDataURL={urlBlur}
      quality={quality}
      loading={loading}
      // No default here. `sizes` is a viewport-width media-condition string
      // (e.g. `(max-width: 600px) 100vw, 50vw`) — `'1x 100vw, 2x 50vw'` used
      // `srcset` x-descriptor syntax instead, which is invalid for `sizes`.
      // An invalid/unparseable `sizes` makes the browser treat the image as
      // full-viewport-width, so next/image generated the entire `deviceSizes`
      // srcset (up to 2048px) even for small fixed-size images. Leaving
      // `sizes` undefined for fixed-width/height images lets next/image emit
      // the correct 1x/2x srcset on its own; call sites rendering full-bleed
      // or responsive images (grids, hero) should pass an explicit `sizes`.
      sizes={sizes}
      src={src as StaticImageData | string}
      unoptimized={unoptimized}
      onClick={onClick}
      onLoad={onLoad}
      preload={preload}
      fetchPriority={preload ? 'high' : 'auto'}
      // loader={({ src }) => src}
    />
  );

  if (pictureClassName) return <picture className={cn(pictureClassName)}>{image}</picture>;

  return image;
};
