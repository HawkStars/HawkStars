'use client';

import React from 'react';
import type { TimelineBlock as TimelineBlockProps } from '@/payload-types';
import { cn } from '@/lib/utils';
import { ImageMedia } from '@/payload/components/Media';
import { HawkStarsSection } from '@/components/layout';
import { Language } from '@/i18n/settings';
import { useTranslation } from '@/i18n/client';
import { Reveal } from '@/components/ui/motion';
import SectionHeader from '@/components/ui/SectionHeader';

const yearBadge =
  'bg-green flex items-center justify-center rounded-full text-xs leading-tight font-bold text-white shadow-md ring-4 ring-white';

export const TimelineBlock: React.FC<TimelineBlockProps & { lng: Language }> = ({
  eyebrow,
  title,
  items = [],
  orientation = 'vertical',
  highlightLast,
  sectionId,
  blockType = 'timeline',
  lng,
}) => {
  const { t } = useTranslation(lng, 'common');

  if (!items || items.length === 0) {
    return null;
  }

  const lastIndex = items.length - 1;

  return (
    <HawkStarsSection
      spacing='default'
      padding='none'
      cap='none'
      container
      id={sectionId || undefined}
      data-blockid={blockType}
    >
      {(title || eyebrow) && (
        <SectionHeader
          reveal
          align='center'
          eyebrow={eyebrow}
          title={title}
          className='mb-12 lg:mb-20'
        />
      )}

      {orientation === 'vertical' && (
        // Mobile: one rail on the left, the year as an eyebrow inside each card.
        // `lg:`: the rail moves to the centre, cards alternate sides and the year is set
        // large on the opposite side, so the dates read as a column of their own.
        <div className='relative'>
          <Reveal
            from='draw-y'
            className='from-green/10 via-green/40 to-green/10 absolute top-2 bottom-2 left-3 w-0.5 origin-top -translate-x-1/2 bg-linear-to-b lg:left-1/2'
          />
          <ol className='flex flex-col gap-8 lg:gap-14'>
            {items.map((item, index) => {
              const left = index % 2 === 0;
              const current = Boolean(highlightLast) && index === lastIndex;
              return (
                <Reveal
                  as='li'
                  from={left ? 'left' : 'right'}
                  key={item.id || index}
                  className='relative pl-10 lg:grid lg:grid-cols-2 lg:items-center lg:gap-24 lg:pl-0'
                >
                  {/* Marker on the rail */}
                  <span
                    aria-hidden='true'
                    className={cn(
                      'absolute top-6 left-3 z-10 flex -translate-x-1/2 items-center justify-center rounded-full ring-4 ring-white lg:top-1/2 lg:left-1/2 lg:-translate-y-1/2',
                      current ? 'bg-green size-6' : 'bg-green size-4'
                    )}
                  >
                    {current && (
                      <span className='bg-green absolute inset-0 animate-ping rounded-full opacity-40' />
                    )}
                  </span>

                  {/* Big year, opposite the card (desktop only; the card repeats it for mobile). */}
                  <p
                    aria-hidden='true'
                    className={cn(
                      'font-display hidden text-6xl leading-none font-semibold lg:block xl:text-7xl',
                      current ? 'text-green' : 'text-green/80',
                      left ? 'lg:order-2 lg:text-left' : 'lg:order-1 lg:text-right'
                    )}
                  >
                    {item.year}
                  </p>

                  <article
                    className={cn(
                      'group overflow-hidden rounded-xl border transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg',
                      left ? 'lg:order-1' : 'lg:order-2',
                      current
                        ? 'bg-green border-green text-white shadow-md'
                        : 'border-bege-dark bg-white shadow-sm'
                    )}
                  >
                    {item.image && (
                      <div className='bg-bege-dark relative h-44 w-full overflow-hidden'>
                        <ImageMedia
                          resource={item.image}
                          alt={item.title}
                          fill
                          sizes='(min-width: 1024px) 40vw, 100vw'
                          className='object-cover transition-transform duration-700 group-hover:scale-105'
                        />
                      </div>
                    )}
                    <div
                      className={cn(
                        'border-l-4 p-5 lg:p-7',
                        current ? 'border-bege-dark' : 'border-green'
                      )}
                    >
                      <p
                        className={cn(
                          'text-eyebrow mb-2',
                          current ? 'text-bege-dark' : 'text-green'
                        )}
                      >
                        <time>{item.year}</time>
                      </p>
                      <h3 className='text-h2_bold'>{item.title}</h3>
                      <p
                        className={cn(
                          'text-body_regular mt-3 leading-relaxed',
                          current ? 'text-white/90' : 'text-black/75'
                        )}
                      >
                        {item.description}
                      </p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
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
            <Reveal
              from='draw-x'
              className='bg-green/30 absolute top-10 right-0 left-0 h-0.5 origin-left'
            />
            <Reveal as='ol' stagger className='flex'>
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
            </Reveal>
          </div>
        </div>
      )}
    </HawkStarsSection>
  );
};
