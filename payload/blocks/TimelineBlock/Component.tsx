'use client';

import React from 'react';
import type { TimelineBlock as TimelineBlockProps } from '@/payload-types';
import { cn } from '@/lib/utils';
import { ImageMedia } from '@/payload/components/Media';
import { HawkStarsSection } from '@/components/layout';
import { Language } from '@/i18n/settings';
import { useTranslation } from '@/i18n/client';

const yearBadge =
  'bg-green flex items-center justify-center rounded-full text-xs leading-tight font-bold text-white shadow-md ring-4 ring-white';

export const TimelineBlock: React.FC<TimelineBlockProps & { lng: Language }> = ({
  title,
  items = [],
  orientation = 'vertical',
  sectionId,
  blockType = 'timeline',
  lng,
}) => {
  const { t } = useTranslation(lng, 'common');

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <HawkStarsSection
      spacing='default'
      padding='none'
      cap='none'
      container
      id={sectionId || undefined}
      data-blockid={blockType}
    >
      {title && <h2 className='text-h2_semibold section-header text-center'>{title}</h2>}

      {orientation === 'vertical' && (
        // Mobile: a single rail down the left with cards beside it (the old alternating
        // 5/12 columns left ~100px of text at 375px). From `lg:` it alternates either side.
        <div className='relative'>
          <div
            aria-hidden='true'
            className='bg-green/20 absolute top-0 bottom-0 left-7 w-px -translate-x-1/2 lg:left-1/2'
          />
          <ol>
            {items.map((item, index) => (
              <li
                key={item.id || index}
                className={cn(
                  'relative mb-10 pl-20 last:mb-0 lg:mb-16 lg:flex lg:pl-0',
                  index % 2 === 0 ? 'lg:justify-start' : 'lg:justify-end'
                )}
              >
                <div className={cn('lg:w-5/12', index % 2 === 0 ? 'lg:pr-14' : 'lg:pl-14')}>
                  <article className='card-md overflow-hidden'>
                    <div className='bg-bege-light border-bege-dark border-b px-5 py-3 lg:px-6'>
                      <h3 className='text-h3_semibold'>{item.title}</h3>
                    </div>
                    <div className='p-5 lg:p-6'>
                      <p className='text-body_regular leading-relaxed text-black/80'>
                        {item.description}
                      </p>
                      {item.image && (
                        <div className='bg-bege-dark relative mt-4 h-48 w-full overflow-hidden rounded-lg'>
                          <ImageMedia
                            resource={item.image}
                            alt={item.title}
                            fill
                            className='object-cover'
                          />
                        </div>
                      )}
                    </div>
                  </article>
                </div>

                {/* Year badge on the rail */}
                <div className='absolute top-0 left-7 z-10 -translate-x-1/2 lg:left-1/2'>
                  <div className={cn(yearBadge, 'h-14 w-14')}>{item.year}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {orientation === 'horizontal' && (
        // Keyboard-scrollable region: focusable, named, and snapping card by card.
        <div
          role='region'
          aria-label={title || t('a11y.timeline')}
          tabIndex={0}
          className='focus-visible:ring-green -mx-4 snap-x snap-mandatory overflow-x-auto scroll-smooth px-4 pb-4 focus-visible:ring-2 focus-visible:outline-none sm:mx-0 sm:px-0'
        >
          <div className='relative w-max'>
            {/* Horizontal connecting line through the year dots */}
            <div aria-hidden='true' className='bg-green/20 absolute top-10 right-0 left-0 h-px' />
            <ol className='flex'>
              {items.map((item, index) => (
                <li key={item.id || index} className='w-72 shrink-0 snap-start p-4'>
                  <div className='relative mb-8 flex justify-center'>
                    <div className={cn(yearBadge, 'h-12 w-12')}>{item.year}</div>
                  </div>
                  <article className='card-md overflow-hidden'>
                    <div className='bg-bege-light border-bege-dark border-b px-5 py-3'>
                      <h3 className='text-body_semibold'>{item.title}</h3>
                    </div>
                    <div className='p-5'>
                      <p className='text-sm leading-relaxed text-black/80'>{item.description}</p>
                    </div>
                  </article>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </HawkStarsSection>
  );
};
