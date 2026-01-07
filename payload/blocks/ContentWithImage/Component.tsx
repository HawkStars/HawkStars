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
}) => {
  const isImageLeft = imagePosition === 'left';
  const imageInfo = getImagePayloadUrl(image);

  return (
    <div className='container mx-auto py-52'>
      <div className='grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12'>
        {/* Image Section */}
        <div className={cn('relative w-full', isImageLeft ? 'lg:order-2' : 'lg:order-1')}>
          {imageInfo && (
            <Image
              src={imageInfo.url}
              alt={imageInfo.alt || ''}
              fill={imageInfo.width === undefined && imageInfo.height === undefined}
              width={imageInfo.width || undefined}
              height={imageInfo.height || undefined}
              className='border-border absolute w-full rounded-lg border object-cover'
            />
          )}
        </div>

        {/* Content Section */}
        <div className={cn('w-full', isImageLeft ? 'lg:order-1' : 'lg:order-2')}>
          <h2 className='mb-4 text-3xl font-bold lg:text-4xl'>{title}</h2>
          {description && <RichText data={description} />}
        </div>
      </div>
    </div>
  );
};
