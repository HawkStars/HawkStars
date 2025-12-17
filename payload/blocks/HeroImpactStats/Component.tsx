import React from 'react';
import { Heart, Users, Globe, Target, TrendingUp, Award } from 'lucide-react';
import type { HeroImpactStatsBlock } from '@/payload-types';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const iconMap = {
  heart: Heart,
  users: Users,
  globe: Globe,
  target: Target,
  trendingUp: TrendingUp,
  award: Award,
};

const HeroImpactStatsBlock: React.FC<HeroImpactStatsBlock> = (data) => {
  if (!data) return null;

  const {
    badge,
    title,
    description,
    heroImage,
    stats = [],
    ctaText,
    ctaLink,
    secondaryCtaText,
    secondaryCtaLink,
  } = data;

  const image = typeof heroImage === 'string' ? null : heroImage;

  return (
    <section className='bg-linear-to-br from-green-50 to-blue-50 py-16 lg:py-24'>
      <div className='container mx-auto px-4'>
        <div className='grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16'>
          {/* Left Column - Content */}
          <div className='space-y-8'>
            {badge && (
              <span className='inline-block rounded-full bg-green-600 px-4 py-1.5 text-sm font-semibold text-white'>
                {badge}
              </span>
            )}

            {title && (
              <h1 className='text-4xl leading-tight font-bold text-gray-900 lg:text-5xl xl:text-6xl'>
                {title}
              </h1>
            )}

            {description && <p className='text-lg text-gray-600 lg:text-xl'>{description}</p>}

            {/* Impact Stats */}
            {stats && stats.length > 0 && (
              <div className='grid grid-cols-2 gap-6'>
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon
                    ? iconMap[stat.icon as keyof typeof iconMap]
                    : Heart;
                  return (
                    <div key={index} className='space-y-2'>
                      <div className='flex items-center gap-3'>
                        {IconComponent && (
                          <IconComponent className='h-6 w-6 text-green-600' strokeWidth={2} />
                        )}
                        <span className='text-3xl font-bold text-green-600 lg:text-4xl'>
                          {stat.number}
                        </span>
                      </div>
                      <p className='text-sm font-medium text-gray-700 lg:text-base'>{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* CTA Buttons */}
            {(ctaText || secondaryCtaText) && (
              <div className='flex flex-col gap-4 sm:flex-row'>
                {ctaLink && ctaText && (
                  <Button size='lg' className='bg-green-600 hover:bg-green-700' asChild>
                    <a href={ctaLink}>{ctaText}</a>
                  </Button>
                )}
                {secondaryCtaLink && secondaryCtaText && (
                  <Button size='lg' variant='outline' asChild>
                    <a href={secondaryCtaLink}>{secondaryCtaText}</a>
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Image */}
          {image && image.url && (
            <div className='relative'>
              <div className='overflow-hidden rounded-2xl shadow-2xl'>
                <Image
                  src={image.url}
                  alt={image.alt || 'Organization impact'}
                  className='h-full w-full object-cover'
                />
              </div>
              {/* Decorative element */}
              <div className='absolute -right-6 -bottom-6 -z-10 h-full w-full rounded-2xl bg-green-200/50' />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export { HeroImpactStatsBlock };
