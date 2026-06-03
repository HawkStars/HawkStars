import React from 'react';
import { LuCheck, LuStar } from 'react-icons/lu';
import type { PricingTableBlock as PricingTableBlockProps } from '@/payload-types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export const PricingTableBlock: React.FC<PricingTableBlockProps> = ({
  title,
  subtitle,
  tiers = [],
  sectionId,
}) => {
  if (!tiers || tiers.length === 0) {
    return null;
  }

  return (
    <section className='section' id={sectionId || ''} data-blockId='pricingTable'>
      <div className='section-container'>
        {/* Header */}
        {(title || subtitle) && (
          <div className='section-header text-center'>
            {title && <h2 className='mb-4 text-3xl font-bold tracking-tight text-balance lg:text-4xl'>{title}</h2>}
            {subtitle && <p className='mx-auto max-w-2xl text-lg leading-relaxed text-gray-600'>{subtitle}</p>}
          </div>
        )}

        {/* Pricing Cards */}
        <div
          className={cn(
            'grid gap-8',
            tiers.length === 1 && 'mx-auto max-w-md',
            tiers.length === 2 && 'md:grid-cols-2',
            tiers.length === 3 && 'md:grid-cols-3',
            tiers.length === 4 && 'md:grid-cols-2 lg:grid-cols-4'
          )}
        >
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={cn(
                'card-lg relative flex flex-col rounded-2xl border p-8 transition-transform duration-300 hover:scale-105',
                tier.highlighted
                  ? 'border-green ring-green ring-2 ring-offset-2'
                  : 'border-gray-200'
              )}
            >
              {/* Badge */}
              {tier.badge && (
                <div className='absolute -top-4 left-1/2 -translate-x-1/2 transform'>
                  <span className='bg-green flex items-center gap-1 rounded-full px-4 py-1 text-sm font-semibold text-white'>
                    <LuStar className='h-4 w-4' />
                    {tier.badge}
                  </span>
                </div>
              )}

              {/* Tier Name */}
              <h3 className='mb-2 text-2xl font-bold'>{tier.name}</h3>

              {/* Description */}
              {tier.description && <p className='mb-6 text-sm text-gray-600'>{tier.description}</p>}

              {/* Price */}
              <div className='mb-6'>
                <div className='flex items-baseline'>
                  <span className='text-sm font-semibold text-gray-600'>{tier.currency}</span>
                  <span className='ml-1 text-5xl font-bold'>{tier.price}</span>
                  {tier.period && <span className='ml-2 text-gray-600'>{tier.period}</span>}
                </div>
              </div>

              {/* Features */}
              {tier.features && tier.features.length > 0 && (
                <ul className='mb-8 flex-1 space-y-3'>
                  {tier.features.map((item, featureIndex) => (
                    <li key={featureIndex} className='flex items-start gap-3'>
                      <LuCheck className='mt-0.5 h-5 w-5 shrink-0 text-green-500' />
                      <span className='text-gray-700'>{item.feature}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* CTA Button */}
              {tier.buttonLink && tier.buttonText && (
                <Button
                  size='lg'
                  variant={tier.highlighted ? 'default' : 'outline'}
                  className='w-full'
                  asChild
                >
                  <a href={tier.buttonLink}>{tier.buttonText}</a>
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
