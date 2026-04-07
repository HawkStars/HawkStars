import React from 'react';
import type { ContentWithImageBlock as ContentWithImageProps } from '@/payload-types';
import RichText from '@/payload/components/RichText';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getImagePayloadUrl } from '@/lib/image';

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
    <div className='container mx-auto py-20 max-lg:py-16' id={sectionId || ''}>
      <div className='grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12'>
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
              className='absolute max-w-full rounded-lg object-cover'
            />
          )}
        </div>

        {/* Content Section */}
        <div className={cn('w-full', isImageLeft ? 'lg:order-1' : 'lg:order-2')}>
          <h2 className='mb-4 text-3xl font-bold max-lg:text-center lg:text-4xl'>{title}</h2>
          {description && <RichText data={description} />}
        </div>
      </div>
    </div>
  );
};
