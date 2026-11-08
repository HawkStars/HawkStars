import { getImagePayloadUrl } from '@/lib/image';
import { cn } from '@/lib/utils';
import { MultiRowImageBlock } from '@/payload-types';
import { ImageMedia } from '@/payload/components/Media';
import { HawkStarsSection } from '@/components/layout';
import React from 'react';

// Full `lg:` class literals: the old `lg:${gridColumn[n]}` template string was invisible
// to Tailwind's scanner and only worked when another file happened to use the same class.
const gridColumnLg = {
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
  7: 'lg:grid-cols-7',
  8: 'lg:grid-cols-8',
  9: 'lg:grid-cols-9',
  10: 'lg:grid-cols-10',
  11: 'lg:grid-cols-11',
  12: 'lg:grid-cols-12',
};

const rowSpanLg = {
  1: 'lg:row-span-1',
  2: 'lg:row-span-2',
  3: 'lg:row-span-3',
  4: 'lg:row-span-4',
  5: 'lg:row-span-5',
  6: 'lg:row-span-6',
  7: 'lg:row-span-7',
  8: 'lg:row-span-8',
  9: 'lg:row-span-9',
  10: 'lg:row-span-10',
  11: 'lg:row-span-11',
  12: 'lg:row-span-12',
} as const;

const colSpanLg = {
  1: 'lg:col-span-1',
  2: 'lg:col-span-2',
  3: 'lg:col-span-3',
  4: 'lg:col-span-4',
  5: 'lg:col-span-5',
  6: 'lg:col-span-6',
  7: 'lg:col-span-7',
  8: 'lg:col-span-8',
  9: 'lg:col-span-9',
  10: 'lg:col-span-10',
  11: 'lg:col-span-11',
  12: 'lg:col-span-12',
} as const;

const MultiRowImage: React.FC<MultiRowImageBlock> = ({
  rows,
  rowGap = 24,
  columnGap = 16,
  sectionId,
  numberColumns,
}) => {
  const rowInfo = rows && rows[0];
  if (!rowInfo) return null;
  return (
    <HawkStarsSection
      spacing='tight'
      padding='none'
      cap='none'
      container
      id={sectionId || undefined}
      data-blockid='multiRowImage'
    >
      <div className='relative'>
        <div
          data-reveal-stagger='scale'
          className={cn('grid grid-flow-dense grid-cols-1', gridColumnLg[numberColumns])}
          style={{
            rowGap: `${rowGap}px`,
            columnGap: `${columnGap}px`,
          }}
        >
          {rowInfo.images.map((img, imgIdx) => {
            const { image, column_size, row_size } = img;
            const imgInfo = getImagePayloadUrl(image);
            if (!imgInfo?.url) return null;

            return (
              <div
                className={cn(
                  'bg-bege-dark relative aspect-video h-full w-full grow overflow-hidden rounded-xl',
                  column_size && colSpanLg[column_size],
                  row_size && rowSpanLg[row_size]
                )}
                key={img.id || imgIdx}
              >
                <ImageMedia
                  className='object-cover'
                  src={imgInfo.url}
                  fill
                  alt={imgInfo.alt || ''}
                  sizes='(max-width: 1024px) 100vw, 50vw'
                />
              </div>
            );
          })}
        </div>
      </div>
    </HawkStarsSection>
  );
};

export default MultiRowImage;
