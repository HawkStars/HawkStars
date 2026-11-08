import React from 'react';
import { cn } from '@/lib/utils';
import { HawkStarsSection } from '@/components/layout';
import type { OfferCatalogBlock as OfferCatalogBlockProps } from '@/payload-types';

const backgroundStyles = {
  white: 'bg-white text-black',
  bege: 'bg-bege-light text-black',
  green: 'bg-green text-white',
} as const;

const badgeStyles = {
  white: 'bg-green/10 text-green',
  bege: 'bg-white text-green',
  green: 'bg-white/15 text-white',
} as const;

// Rows sit on a white card on light backgrounds (it lifts off bege), and on a hairline
// outline on green, where a white card would read as a hole in the band.
const groupStyles = {
  white: 'card divide-bege-dark border border-bege-dark',
  bege: 'card divide-bege-dark',
  green: 'rounded-xl border border-white/15 divide-white/15',
} as const;

const priceStyles = {
  white: 'text-green',
  bege: 'text-green',
  green: 'text-white',
} as const;

export const OfferCatalogBlock: React.FC<OfferCatalogBlockProps> = ({
  title,
  subtitle,
  background = 'white',
  groups = [],
  sectionId,
}) => {
  if (!groups || groups.length === 0) {
    return null;
  }

  const bg = (background ?? 'white') as keyof typeof backgroundStyles;

  return (
    <HawkStarsSection
      spacing='default'
      padding='none'
      cap='none'
      container
      className={cn(backgroundStyles[bg])}
      id={sectionId || undefined}
      data-blockid='offerCatalog'
    >
      {(title || subtitle) && (
        <div className='section-header text-center'>
          {title && (
            <h2 data-reveal='up' className='text-h2_semibold'>
              {title}
            </h2>
          )}
          {subtitle && (
            <p
              className={cn(
                'text-h2_light mt-4',
                bg === 'green' ? 'text-white/90' : 'text-black/70'
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div data-reveal-stagger='up' className='mx-auto flex max-w-4xl flex-col gap-10'>
        {groups.map((group, groupIndex) => (
          <div key={group.id || groupIndex}>
            {group.groupLabel && <h3 className='text-h2_bold mb-4'>{group.groupLabel}</h3>}
            <div className={cn('divide-y', groupStyles[bg])}>
              {group.items?.map((item, itemIndex) => (
                <div
                  key={item.id || itemIndex}
                  className='flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6'
                >
                  <div>
                    <div className='flex flex-wrap items-center gap-2'>
                      <p className='text-body_semibold'>{item.name}</p>
                      {item.badge && (
                        <span
                          className={cn(
                            'rounded-full px-2.5 py-0.5 text-xs font-semibold',
                            badgeStyles[bg]
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p
                        className={cn(
                          'text-body_regular mt-1 max-w-prose',
                          bg === 'green' ? 'text-white/90' : 'text-black/70'
                        )}
                      >
                        {item.description}
                      </p>
                    )}
                  </div>
                  <p
                    className={cn(
                      'text-body_semibold shrink-0 tabular-nums sm:text-right',
                      priceStyles[bg]
                    )}
                  >
                    {item.price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </HawkStarsSection>
  );
};
