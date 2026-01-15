import React from 'react';
import type { StatsBlock as StatsBlockProps } from '@/payload-types';
import { cn } from '@/lib/utils';
import { getIcon } from '@/lib/icon';
import { CMSLink } from '@/payload/components/Link';

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

const cardBackgroundStyles = {
  white: 'bg-white',
  bege: 'bg-white',
  green: 'bg-green/80',
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

export const StatsBlock: React.FC<StatsBlockProps> = ({
  columns = '3',
  background = 'white',
  hoverBorderColor = 'green',
  stats = [],
  links,
  sectionId,
}) => {
  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <section
      className={cn(
        'py-12 lg:py-20',
        backgroundStyles[background as keyof typeof backgroundStyles]
      )}
      id={sectionId || ''}
    >
      <div className='container mx-auto'>
        {/* Stats Grid */}
        <div className={cn('grid gap-6', columnsClass[columns as keyof typeof columnsClass])}>
          {stats.map((stat, index) => (
            <div
              key={stat.id || index}
              className={cn(
                'flex w-full flex-col rounded-lg border border-transparent p-6 shadow-sm transition-all duration-200',
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
                    'text-3xl font-bold lg:text-4xl',
                    alignmentStyles[(stat.titleAlign || 'center') as keyof typeof alignmentStyles]
                  )}
                >
                  {stat.title}
                </h3>
              )}
              {stat.description && (
                <p
                  className={cn(
                    'mt-2 text-sm opacity-80 lg:text-base',
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
          <div className='mt-10 flex flex-wrap justify-center gap-4'>
            {links.map(({ link }, i) => (
              <CMSLink key={i} size='lg' {...link} appearance={i === 0 ? 'default' : 'outline'} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
