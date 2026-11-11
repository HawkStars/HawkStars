import React from 'react';
import type { ValuesGridBlock as ValuesGridBlockProps } from '@/payload-types';
import { cn } from '@/lib/utils';
import { getIcon } from '@/lib/icon';
import { HawkStarsSection } from '@/components/layout';
import SectionHeader from '@/components/ui/SectionHeader';
import { Reveal } from '@/components/ui/motion';

const columnsClass = {
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
  // Four text-heavy cards are too narrow at `lg`; wait for `xl`.
  '4': 'sm:grid-cols-2 xl:grid-cols-4',
} as const;

const TONE = {
  white: {
    section: 'bg-white text-black',
    card: 'bg-bege-light hover:border-green',
    tile: 'bg-green/10 text-green group-hover:bg-green group-hover:text-white',
    number: 'text-green',
    description: 'text-black/70',
    header: 'green',
  },
  bege: {
    section: 'bg-bege-light text-black',
    card: 'bg-white hover:border-green',
    tile: 'bg-green/10 text-green group-hover:bg-green group-hover:text-white',
    number: 'text-green',
    description: 'text-black/70',
    header: 'green',
  },
  green: {
    section: 'bg-green text-white',
    card: 'bg-white/10 shadow-none hover:border-white/40',
    tile: 'bg-white/15 text-white group-hover:bg-white group-hover:text-green',
    number: 'text-white',
    description: 'text-white',
    header: 'inverse',
  },
} as const;

/**
 * Icon cards in a grid under a section header: values, pillars, principles.
 * Cards without an icon fall back to a number (when `numbered`) so the grid keeps
 * a consistent visual anchor.
 */
export const ValuesGridBlock: React.FC<ValuesGridBlockProps> = ({
  eyebrow,
  title,
  subtitle,
  columns,
  background,
  numbered,
  items,
  sectionId,
}) => {
  if (!items || items.length === 0) return null;

  const tone = TONE[(background ?? 'white') as keyof typeof TONE];
  const grid = columnsClass[(columns ?? '3') as keyof typeof columnsClass];
  const hasHeader = Boolean(title || eyebrow || subtitle);

  return (
    <HawkStarsSection
      spacing='default'
      padding='none'
      cap='none'
      container
      className={tone.section}
      id={sectionId || undefined}
      data-blockid='valuesGrid'
    >
      {hasHeader && (
        <SectionHeader
          reveal
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          variant={tone.header}
          subtitleClassName={background === 'green' ? 'text-white/85' : undefined}
          className='mb-10 lg:mb-14'
        />
      )}

      <Reveal stagger className={cn('grid grid-cols-1 gap-5 lg:gap-6', grid)}>
        {items.map((item, index) => {
          const icon = getIcon(item.icon);
          return (
            <article
              key={item.id || index}
              className={cn(
                'card card-hover group flex h-full flex-col gap-4 border border-transparent p-6 transition-[box-shadow,border-color,translate] duration-300 hover:-translate-y-1 lg:p-8',
                tone.card
              )}
            >
              {icon ? (
                <span
                  aria-hidden='true'
                  className={cn(
                    'flex size-12 items-center justify-center rounded-xl transition-colors duration-300',
                    tone.tile
                  )}
                >
                  {icon}
                </span>
              ) : (
                numbered && (
                  <span aria-hidden='true' className={cn('text-h2_bold', tone.number)}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                )
              )}
              <h3 className='text-xl leading-snug font-semibold'>{item.title}</h3>
              {item.description && (
                <p className={cn('text-base leading-relaxed', tone.description)}>
                  {item.description}
                </p>
              )}
            </article>
          );
        })}
      </Reveal>
    </HawkStarsSection>
  );
};
