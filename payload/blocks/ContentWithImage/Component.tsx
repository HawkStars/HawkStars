import React from 'react';
import type { ContentWithImageBlock as ContentWithImageProps } from '@/payload-types';
import RichText from '@/payload/components/RichText';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getImagePayloadUrl } from '@/lib/image';
import { HawkStarsSection } from '@/components/layout';

export const ContentWithImageBlock: React.FC<ContentWithImageProps> = ({
  title,
  description,
  image,
  imagePosition,
  sectionId,
}) => {
  const isImageLeft = imagePosition === 'left';
  const imageInfo = getImagePayloadUrl(image);

  const customizedHeight = image.height;
  const height = imageInfo?.height;
  const width = imageInfo?.width;

  return (
    <HawkStarsSection
      spacing='default'
      padding='none'
      container
      id={sectionId || undefined}
      data-blockid='contentWithImage'
    >
      <div className='grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16'>
        {/* Image Section */}
        <div
          className={cn('relative w-full', isImageLeft ? 'lg:order-2' : 'lg:order-1', {
            'min-h-lvh': !customizedHeight && (!height || !width),
          })}
          style={{ height: customizedHeight ? `${customizedHeight}px` : undefined }}
        >
          {imageInfo && (
            <Image
              src={imageInfo.url}
              alt={imageInfo.alt || ''}
              fill={imageInfo.width === undefined && imageInfo.height === undefined}
              width={imageInfo.width || undefined}
              height={imageInfo.height || undefined}
              className={cn({
                'absolute object-cover lg:rounded-2xl':
                  imageInfo.width === undefined && imageInfo.height === undefined,
              })}
            />
          )}
        </div>

        {/* Content Section */}
        <div className={cn('w-full', isImageLeft ? 'lg:order-1' : 'lg:order-2')}>
          <h2 className='mb-5 text-3xl font-bold tracking-tight text-balance max-lg:text-center lg:text-4xl'>
            {title}
          </h2>
          {description && <RichText data={description} />}
        </div>
      </div>
    </HawkStarsSection>
  );
};
