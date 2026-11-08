import React from 'react';
import type { ContentWithImageBlock as ContentWithImageProps } from '@/payload-types';
import RichText from '@/payload/components/RichText';
import { ImageMedia } from '@/payload/components/Media';
import { cn } from '@/lib/utils';
import { getImagePayloadUrl } from '@/lib/image';
import { HawkStarsSection } from '@/components/layout';
import { Language } from '@/i18n/settings';

export const ContentWithImageBlock: React.FC<ContentWithImageProps & { lng: Language }> = ({
  title,
  description,
  image,
  imagePosition,
  sectionId,
  lng,
}) => {
  const isImageLeft = imagePosition === 'left';
  const imageInfo = getImagePayloadUrl(image);

  const customizedHeight = image.height;
  const hasIntrinsicSize = Boolean(imageInfo?.width && imageInfo?.height);
  const shouldFill = imageInfo?.width === undefined && imageInfo?.height === undefined;

  return (
    <HawkStarsSection
      spacing='default'
      padding='none'
      cap='none'
      container
      id={sectionId || undefined}
      data-blockid='contentWithImage'
    >
      <div className='grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16'>
        {/* Image Section — rounded on every breakpoint (it was square-cornered on mobile), and a
            4:3 frame replaces the old full-viewport-height box for images of unknown size. */}
        <div
          data-reveal={isImageLeft ? 'right' : 'left'}
          className={cn(
            'group relative w-full overflow-hidden rounded-xl shadow-md',
            isImageLeft ? 'lg:order-2' : 'lg:order-1',
            { 'bg-bege-dark aspect-4/3': !customizedHeight && !hasIntrinsicSize }
          )}
          style={{ height: customizedHeight ? `${customizedHeight}px` : undefined }}
        >
          {imageInfo && (
            <ImageMedia
              src={imageInfo.url}
              alt={imageInfo.alt || ''}
              fill={shouldFill}
              width={imageInfo.width || undefined}
              height={imageInfo.height || undefined}
              className={cn({
                'transition-transform duration-[2s] group-hover:scale-105': true,
                'absolute inset-0 object-cover': shouldFill,
                'h-full w-full object-cover': !shouldFill && customizedHeight,
                'h-auto w-full': !shouldFill && !customizedHeight,
              })}
              sizes='(max-width: 1024px) 100vw, 576px'
            />
          )}
        </div>

        {/* Content Section */}
        <div data-reveal='up' className={cn('w-full', isImageLeft ? 'lg:order-1' : 'lg:order-2')}>
          {/* Left-aligned on mobile too, so the heading lines up with the body copy below it. */}
          {title && <h2 className='text-h2_semibold mb-5'>{title}</h2>}
          {description && <RichText data={description} lng={lng} />}
        </div>
      </div>
    </HawkStarsSection>
  );
};
