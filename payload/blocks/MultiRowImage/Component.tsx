'use client';

import { getImagePayloadUrl } from '@/lib/image';
import { cn } from '@/lib/utils';
import { MultiRowImageBlock } from '@/payload-types';
import Image from 'next/image';
import React from 'react';

const gridColumn = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  7: 'grid-cols-7',
  8: 'grid-cols-8',
  9: 'grid-cols-9',
  10: 'grid-cols-10',
  11: 'grid-cols-11',
  12: 'grid-cols-12',
};

const rowSpan = {
  1: 'row-span-1',
  2: 'row-span-2',
  3: 'row-span-3',
  4: 'row-span-4',
  5: 'row-span-5',
  6: 'row-span-6',
  7: 'row-span-7',
  8: 'row-span-8',
  9: 'row-span-9',
  10: 'row-span-10',
  11: 'row-span-11',
  12: 'row-span-12',
} as const;

const colSpan = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  5: 'col-span-5',
  6: 'col-span-6',
  7: 'col-span-7',
  8: 'col-span-8',
  9: 'col-span-9',
  10: 'col-span-10',
  11: 'col-span-11',
  12: 'col-span-12',
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
    <section className='pb-16' id={sectionId || undefined}>
      <div className='relative container mx-auto'>
        <div
          className={cn(`grid grid-flow-dense lg:${gridColumn[numberColumns]}`)}
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
                  `relative aspect-video h-full w-full grow max-lg:col-span-1! max-lg:row-span-1!`,
                  {
                    [`${colSpan[column_size]}`]: column_size,
                    [`${rowSpan[row_size]}`]: row_size,
                  }
                )}
                key={img.id || imgIdx}
              >
                <Image
                  className={cn('absolute rounded-2xl object-cover')}
                  src={imgInfo.url}
                  fill
                  alt={imgInfo.alt || `Multi Row Image -${imgIdx + 1}`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MultiRowImage;
