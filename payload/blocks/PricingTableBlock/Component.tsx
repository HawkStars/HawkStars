import React from 'react';
import { LuCheck, LuStar } from 'react-icons/lu';
import type { PricingTableBlock as PricingTableBlockProps } from '@/payload-types';
import { cn } from '@/lib/utils';
import { HawkStarsSection } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { isHttpUrl } from '@/utils/paths';
import { Language } from '@/i18n/settings';

/**
 * `buttonLink` is a free-text field with no validator. Rendering it straight into an
 * href let an editor (or a compromised account) store `javascript:` and get script
 * execution for every visitor who clicked the plan button.
 */
const resolveCtaHref = (link: string | null | undefined, lng: Language) => {
  if (!link) return undefined;
  if (link.startsWith('/')) return `/${lng}${link}`;
  if (link.startsWith('#')) return link;
  return isHttpUrl(link) ? link : undefined;
};

export const PricingTableBlock = ({
  title,
  subtitle,
  tiers = [],
  sectionId,
  lng,
}: PricingTableBlockProps & { lng: Language }) => {
  if (!tiers || tiers.length === 0) {
    return null;
  }

  return (
    <HawkStarsSection
      spacing='default'
      padding='none'
      cap='none'
      container
      id={sectionId || undefined}
      data-blockid='pricingTable'
    >
      {/* Header */}
      {(title || subtitle) && (
        <div className='section-header text-center'>
          {title && (
            <h2 data-reveal='up' className='text-h2_semibold'>
              {title}
            </h2>
          )}
          {subtitle && (
            <p data-reveal='up' className='text-h2_light mt-4 text-black/70'>
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Pricing Cards */}
      <div
        data-reveal-stagger='up'
        className={cn(
          // pt-4 leaves room for the badge that overhangs the top of a card.
          'grid gap-6 pt-4 lg:gap-8',
          tiers.length === 1 && 'mx-auto max-w-md',
          tiers.length === 2 && 'md:grid-cols-2',
          tiers.length === 3 && 'md:grid-cols-3',
          tiers.length === 4 && 'md:grid-cols-2 lg:grid-cols-4'
        )}
      >
        {tiers.map((tier, index) => {
          const href = resolveCtaHref(tier.buttonLink, lng);
          return (
            <div
              key={tier.id || index}
              className={cn(
                'relative flex flex-col p-6 transition-[box-shadow,translate] duration-300 hover:-translate-y-1 lg:p-8',
                tier.highlighted
                  ? 'card-md card-hover-lg ring-green ring-2'
                  : 'card card-hover border-bege-dark border'
              )}
            >
              {/* Badge */}
              {tier.badge && (
                <div className='absolute -top-4 left-1/2 -translate-x-1/2'>
                  <span className='bg-green flex items-center gap-1 rounded-full px-4 py-1 text-sm font-semibold whitespace-nowrap text-white'>
                    <LuStar aria-hidden='true' className='size-4' />
                    {tier.badge}
                  </span>
                </div>
              )}

              {/* Tier Name */}
              <h3 className='text-h2_bold mb-2'>{tier.name}</h3>

              {/* Description */}
              {tier.description && (
                <p className='text-body_regular mb-6 text-black/70'>{tier.description}</p>
              )}

              {/* Price */}
              <div className='mb-6 flex flex-wrap items-baseline gap-x-1'>
                <span className='text-body_semibold text-black/70'>{tier.currency}</span>
                <span className='text-h1_semibold tabular-nums'>{tier.price}</span>
                {tier.period && <span className='ml-1 text-black/70'>{tier.period}</span>}
              </div>

              {/* Features */}
              {tier.features && tier.features.length > 0 && (
                <ul className='mb-8 flex-1 space-y-3'>
                  {tier.features.map((item, featureIndex) => (
                    <li key={item.id || featureIndex} className='flex items-start gap-3'>
                      <LuCheck aria-hidden='true' className='text-green mt-0.5 size-5 shrink-0' />
                      <span className='text-body_regular'>{item.feature}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* CTA Button — mt-auto pins it to the bottom so buttons align across cards */}
              {href && tier.buttonText && (
                <Button
                  size='lg'
                  variant={tier.highlighted ? 'default' : 'outline'}
                  className='mt-auto w-full'
                  asChild
                >
                  <a href={href}>{tier.buttonText}</a>
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </HawkStarsSection>
  );
};
