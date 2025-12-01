import React from 'react';
import type { ContentWithImageBlock as ContentWithImageProps } from '@/payload-types';
import { Media } from '../../components/Media';
import RichText from '@/payload/components/RichText';
import { cn } from '@/lib/utils';

export const ContentWithImageBlock: React.FC<ContentWithImageProps> = ({
  title,
  description,
  image,
  imagePosition,
}) => {
  const isImageLeft = imagePosition === 'left';

  return (
    <div className='container'>
      <div className='grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12'>
        {/* Image Section */}
        <div className={cn('w-full', isImageLeft ? 'lg:order-2' : 'lg:order-1')}>
          {image && typeof image === 'object' && (
            <Media
              resource={image}
              imgClassName='w-full rounded-lg border border-border object-cover'
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
