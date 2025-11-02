import React from 'react';
import type { ContentWithImageBlock as ContentWithImageProps } from '@/payload-types';
import { Media } from '../../components/Media';
import RichText from '@/payload/components/RichText';
import { cn } from '@/payload/utilities/ui';

export const ContentWithImageBlock: React.FC<ContentWithImageProps> = ({
  title,
  description,
  image,
  imagePosition,
}) => {
  const isImageLeft = imagePosition === 'left';

  return (
    <div className='container'>
      <div
        className={cn(
          'grid gap-8 lg:grid-cols-2 lg:gap-12',
          'items-center',
          isImageLeft && 'lg:flex lg:flex-row-reverse'
        )}
      >
        {/* Image Section */}
        <div className={cn('w-full', isImageLeft ? 'lg:order-1' : 'lg:order-2')}>
          {image && typeof image === 'object' && (
            <Media
              resource={image}
              imgClassName='w-full rounded-lg border border-border object-cover'
            />
          )}
        </div>

        {/* Content Section */}
        <div className={cn('w-full', isImageLeft ? 'lg:order-2' : 'lg:order-1')}>
          <h2 className='mb-4 text-3xl font-bold lg:text-4xl'>{title}</h2>
          {description && (
            <RichText
              data={description}
              enableGutter={false}
              enableProse={true}
              className='prose-lg'
            />
          )}
        </div>
      </div>
    </div>
  );
};
