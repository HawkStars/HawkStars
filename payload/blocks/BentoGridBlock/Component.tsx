'use client';

import { getImagePayloadUrl } from '@/lib/image';
import { cn } from '@/lib/utils';
import { BentoGridBlock as BentoGridBlockProps } from '@/payload-types';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import React, { use } from 'react';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { getLinkFieldInformation } from '@/utils/page';

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
} as const;

const rowSpanLg = {
  1: 'lg:row-span-1',
  2: 'lg:row-span-2',
  3: 'lg:row-span-3',
  4: 'lg:row-span-4',
  5: 'lg:row-span-5',
  6: 'lg:row-span-6',
} as const;

const colSpanMd = {
  1: 'md:col-span-1',
  2: 'md:col-span-1',
  3: 'md:col-span-1',
  4: 'md:col-span-2',
  5: 'md:col-span-2',
  6: 'md:col-span-2',
} as const;

const colSpanLg = {
  1: 'lg:col-span-1',
  2: 'lg:col-span-2',
  3: 'lg:col-span-3',
  4: 'lg:col-span-4',
  5: 'lg:col-span-5',
  6: 'lg:col-span-6',
} as const;

const overlayOpacityMap = {
  '0': 'bg-black/0',
  '25': 'bg-black/25',
  '50': 'bg-black/50',
  '75': 'bg-black/75',
  '90': 'bg-black/90',
} as const;

const contentPositionMap = {
  'top-left': 'items-start justify-start text-left',
  'top-center': 'items-start justify-center text-center',
  'top-right': 'items-start justify-end text-right',
  'center-left': 'items-center justify-start text-left',
  center: 'items-center justify-center text-center',
  'center-right': 'items-center justify-end text-right',
  'bottom-left': 'items-end justify-start text-left',
  'bottom-center': 'items-end justify-center text-center',
  'bottom-right': 'items-end justify-end text-right',
} as const;

const BentoGridBlock: React.FC<BentoGridBlockProps> = ({
  sectionTitle,
  sectionDescription,
  items,
  rowGap = 24,
  columnGap = 16,
  numberColumns,
  minRowHeight = 200,
  sectionId,
}) => {
  const lng = useLanguageCookie();
  if (!items || items.length === 0) return null;

  return (
    <section className='py-8 md:py-12 lg:py-16' id={sectionId || undefined}>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        {(sectionTitle || sectionDescription) && (
          <div className='mx-auto mb-8 max-w-3xl text-center md:mb-10 lg:mb-12'>
            {sectionTitle && (
              <h2 className='text-2xl font-semibold text-pretty sm:text-3xl lg:text-4xl'>
                {sectionTitle}
              </h2>
            )}
            {sectionDescription && (
              <p className='text-muted-foreground mt-3 text-base md:mt-4 md:text-lg'>
                {sectionDescription}
              </p>
            )}
          </div>
        )}

        <div
          className={cn(
            'grid grid-flow-dense grid-cols-1 md:grid-cols-2',
            gridColumnLg[numberColumns]
          )}
          style={{
            rowGap: `clamp(12px, ${rowGap}px, ${rowGap}px)`,
            columnGap: `clamp(12px, ${columnGap}px, ${columnGap}px)`,
            gridAutoRows: `minmax(${Math.max((minRowHeight ?? 200) * 0.6, 150)}px, auto)`,
          }}
        >
          {items.map((item, idx) => {
            const { title, description, backgroundImage, link, column_size, row_size } = item;
            const imgInfo = backgroundImage ? getImagePayloadUrl(backgroundImage) : null;
            const overlayOpacity = (item.overlayOpacity || '50') as keyof typeof overlayOpacityMap;
            const contentPosition = (item.contentPosition ||
              'bottom-left') as keyof typeof contentPositionMap;
            const linkInfo = getLinkFieldInformation(item.link, lng);
            const isExternalLink = link?.type === 'custom' && link?.newTab;

            return (
              <div
                className={cn(
                  'group relative flex min-h-45 overflow-hidden rounded-xl md:min-h-50 md:rounded-2xl',
                  'col-span-1 row-span-1',
                  colSpanMd[column_size],
                  colSpanLg[column_size],
                  rowSpanLg[row_size],
                  !imgInfo && 'bg-accent'
                )}
                key={item.id || idx}
              >
                {/* Background Image */}
                {imgInfo?.url && (
                  <>
                    <Image
                      className='absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                      src={imgInfo.url}
                      fill
                      alt={imgInfo.alt || title || `Bento Grid Item ${idx + 1}`}
                    />
                    {/* Overlay */}
                    <div
                      className={cn(
                        'absolute inset-0 transition-opacity duration-300',
                        overlayOpacityMap[overlayOpacity]
                      )}
                    />
                  </>
                )}

                {/* Content */}
                <div
                  className={cn(
                    'relative z-10 flex h-full w-full flex-col p-4 sm:p-5 md:p-6',
                    contentPositionMap[contentPosition]
                  )}
                >
                  <div
                    className={cn('flex max-w-md flex-col gap-2 sm:gap-3', {
                      'items-start': contentPosition.includes('left'),
                      'items-center': contentPosition.includes('center'),
                      'items-end': contentPosition.includes('right'),
                    })}
                  >
                    {title && (
                      <h3
                        className={cn('text-lg font-semibold sm:text-xl lg:text-2xl', {
                          'text-white': imgInfo?.url,
                          'text-foreground': !imgInfo?.url,
                        })}
                      >
                        {title}
                      </h3>
                    )}
                    {description && (
                      <p
                        className={cn('line-clamp-2 text-sm sm:line-clamp-3 md:text-base', {
                          'text-white/90': imgInfo?.url,
                          'text-muted-foreground': !imgInfo?.url,
                        })}
                      >
                        {description}
                      </p>
                    )}
                    {link?.label && (
                      <Button
                        asChild
                        variant={imgInfo?.url ? 'secondary' : 'default'}
                        size='sm'
                        className='mt-1 sm:mt-2'
                      >
                        <Link
                          href={linkInfo?.url || '#'}
                          target={isExternalLink ? '_blank' : '_self'}
                          rel={isExternalLink ? 'noopener noreferrer' : undefined}
                        >
                          {linkInfo?.label}
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BentoGridBlock;
