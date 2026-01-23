import React from 'react';
import { Heart, Users, Globe, Target, TrendingUp, Award } from 'lucide-react';
import type { HeroImpactStatsBlock } from '@/payload-types';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { getImagePayloadUrl } from '@/lib/image';
import { getLinkFieldInformation } from '@/utils/page';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';

const iconMap = {
  heart: Heart,
  users: Users,
  globe: Globe,
  target: Target,
  trendingUp: TrendingUp,
  award: Award,
};

const HeroImpactStatsBlock: React.FC<HeroImpactStatsBlock> = (data) => {
  const lng = useLanguageCookie();
  if (!data) return null;

  const { badge, title, description, heroImage, stats = [], links = [], sectionId } = data;

  const image = getImagePayloadUrl(heroImage);
  const primaryCta = links && links[0]?.link;
  const secondaryCta = links && links[1]?.link;
  const primaryCTAInfo = primaryCta && getLinkFieldInformation(primaryCta, lng);
  const secondaryCTAInfo = secondaryCta && getLinkFieldInformation(secondaryCta, lng);

  return (
    <section
      className='bg-linear-to-br from-green-50 to-blue-50 py-16 lg:py-24'
      id={sectionId || ''}
    >
      <div className='container mx-auto px-4'>
        <div className='grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16'>
          {/* Left Column - Content */}
          <div className='space-y-8'>
            {badge && (
              <span className='bg-green inline-block rounded-full px-4 py-1.5 text-sm font-semibold text-white'>
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
            {(primaryCTAInfo || secondaryCTAInfo) && (
              <div className='flex flex-col gap-4 sm:flex-row'>
                {primaryCTAInfo && (
                  <Button size='lg' className='bg-green-600 hover:bg-green-700' asChild>
                    <a
                      href={primaryCTAInfo.url}
                      target={primaryCTAInfo.newTab ? '_blank' : undefined}
                    >
                      {primaryCTAInfo.label}
                    </a>
                  </Button>
                )}
                {secondaryCTAInfo && (
                  <Button size='lg' variant='outline' asChild>
                    <a
                      href={secondaryCTAInfo.url}
                      target={secondaryCTAInfo.newTab ? '_blank' : undefined}
                    >
                      {secondaryCTAInfo.label}
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Image */}
          {image && image.url && (
            <div>
              <div className='relative h-full min-h-75 overflow-hidden rounded-2xl shadow-2xl'>
                <Image
                  src={image.url}
                  alt={image.alt || 'Organization impact'}
                  className='absolute h-full w-full object-cover'
                  fill
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
