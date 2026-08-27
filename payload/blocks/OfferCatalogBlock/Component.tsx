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
      container
      className={cn(backgroundStyles[bg])}
      id={sectionId || undefined}
      data-blockid='offerCatalog'
    >
      {(title || subtitle) && (
        <div className='mx-auto mb-12 max-w-3xl text-center lg:mb-14'>
          {title && <h2 className='text-h1_semibold tracking-tight text-balance'>{title}</h2>}
          {subtitle && <p className='text-body_semibold mt-3 leading-relaxed'>{subtitle}</p>}
        </div>
      )}

      <div className='mx-auto flex max-w-4xl flex-col gap-10'>
        {groups.map((group, groupIndex) => (
          <div key={group.id || groupIndex}>
            {group.groupLabel && (
              <h3 className='text-h4_semibold mb-4 tracking-tight'>{group.groupLabel}</h3>
            )}
            <div
              className={cn(
                'divide-y rounded-2xl border',
                bg === 'green'
                  ? 'divide-white/15 border-white/15'
                  : 'divide-bege-dark border-bege-dark'
              )}
            >
              {group.items?.map((item, itemIndex) => (
                <div
                  key={item.id || itemIndex}
                  className='flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6'
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
                      <p className='text-small mt-1 opacity-80'>{item.description}</p>
                    )}
                  </div>
                  <p className={cn('text-body_semibold shrink-0 sm:text-right', priceStyles[bg])}>
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
