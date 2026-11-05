import React from 'react';
import type { StatsBlock as StatsBlockProps } from '@/payload-types';
import { cn } from '@/lib/utils';
import { getIcon } from '@/lib/icon';
import { CMSLink } from '@/payload/components/Link';
import { HawkStarsSection } from '@/components/layout';
import { Language } from '@/i18n/settings';

const columnsClass = {
  '2': 'grid-cols-1 sm:grid-cols-2',
  '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  '5': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5',
} as const;

const backgroundStyles = {
  white: 'bg-white text-black',
  bege: 'bg-bege-light text-black',
  green: 'bg-green text-white',
} as const;

// On white sections the cards take the warm tint so they still read as cards.
const cardBackgroundStyles = {
  white: 'bg-bege-light',
  bege: 'bg-white',
  green: 'bg-white/10 shadow-none',
} as const;

const valueStyles = {
  white: 'text-green',
  bege: 'text-green',
  green: 'text-white',
} as const;

const descriptionStyles = {
  white: 'text-black/70',
  bege: 'text-black/70',
  green: 'text-white',
} as const;

const hoverBorderStyles = {
  green: 'hover:border-green',
  bege: 'hover:border-bege-dark',
} as const;

const iconStyles = {
  white: 'text-green',
  bege: 'text-green',
  green: 'text-white',
} as const;

const alignmentStyles = {
  left: 'self-start text-left',
  center: 'self-center text-center',
  right: 'self-end text-right',
} as const;

export const StatsBlock = ({
  columns = '3',
  background = 'white',
  hoverBorderColor = 'green',
  stats = [],
  links,
  sectionId,
  lng,
}: StatsBlockProps & { lng: Language }) => {
  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <HawkStarsSection
      spacing='default'
      padding='none'
      cap='none'
      container
      className={cn(backgroundStyles[background as keyof typeof backgroundStyles])}
      id={sectionId || undefined}
      data-blockid='statsBlock'
    >
      {/* Stats Grid */}
      <div
        className={cn('grid gap-6 lg:gap-8', columnsClass[columns as keyof typeof columnsClass])}
      >
        {stats.map((stat, index) => (
          <div
            key={stat.id || index}
            className={cn(
              'card card-hover flex w-full flex-col border border-transparent p-6 transition-[box-shadow,border-color] duration-200',
              columns === '5' ? 'lg:p-6' : 'lg:p-8',
              cardBackgroundStyles[background as keyof typeof cardBackgroundStyles],
              hoverBorderStyles[hoverBorderColor as keyof typeof hoverBorderStyles]
            )}
          >
            {stat.icon && (
              <div
                className={cn(
                  'mb-4',
                  iconStyles[background as keyof typeof iconStyles],
                  alignmentStyles[(stat.iconAlign || 'center') as keyof typeof alignmentStyles]
                )}
              >
                {getIcon(stat.icon)}
              </div>
            )}
            {stat.title && (
              <h3
                className={cn(
                  // The number is the hero of the card: display face, brand colour.
                  'text-h1_semibold',
                  valueStyles[background as keyof typeof valueStyles],
                  alignmentStyles[(stat.titleAlign || 'center') as keyof typeof alignmentStyles]
                )}
              >
                {stat.title}
              </h3>
            )}
            {stat.description && (
              <p
                className={cn(
                  'mt-3 text-sm leading-relaxed lg:text-base',
                  descriptionStyles[background as keyof typeof descriptionStyles],
                  alignmentStyles[
                    (stat.descriptionAlign || 'center') as keyof typeof alignmentStyles
                  ]
                )}
              >
                {stat.description}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* CTA Buttons */}
      {links && links.length > 0 && (
        <div className='mt-10 flex flex-wrap justify-center gap-4 lg:mt-14'>
          {links.map(({ link }, i) => (
            <CMSLink
              key={i}
              lng={lng}
              size='lg'
              {...link}
              appearance={i === 0 ? 'default' : 'outline'}
            />
          ))}
        </div>
      )}
    </HawkStarsSection>
  );
};
