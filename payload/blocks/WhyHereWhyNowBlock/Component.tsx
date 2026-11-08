import React from 'react';
import { cn } from '@/lib/utils';
import { getImagePayloadUrl } from '@/lib/image';
import { ImageMedia } from '@/payload/components/Media';
import { WhyHereWhyNowBlock as WhyHereWhyNowBlockProps } from '@/payload-types';
import { HawkStarsSection } from '@/components/layout';

const backgroundStyles = {
  white: 'bg-white text-black',
  bege: 'bg-bege-light text-black',
  green: 'bg-green text-white',
} as const;

const subtitleStyles = {
  white: 'text-black/70',
  bege: 'text-black/70',
  green: 'text-white/85',
} as const;

const badgeStyles = {
  white: 'text-green',
  bege: 'text-green',
  green: 'text-white/85',
} as const;

export const WhyHereWhyNowBlock: React.FC<WhyHereWhyNowBlockProps> = ({
  title,
  subtitle,
  badge,
  background = 'bege',
  challenges = [],
  sectionId,
}) => {
  if (!challenges || challenges.length === 0) {
    return null;
  }

  const bg = (background ?? 'bege') as keyof typeof backgroundStyles;

  return (
    <HawkStarsSection
      spacing='default'
      padding='none'
      cap='none'
      container
      className={cn(backgroundStyles[bg])}
      id={sectionId || undefined}
      data-blockid='whyHereWhyNowBlock'
    >
      {/* Header */}
      {/* Section heading on the section scale (was h1-sized), lead line on the subtitle scale
          and capped at a readable width. */}
      <div className='mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between md:mb-12 lg:mb-14'>
        <div className='max-w-3xl'>
          {title && (
            <h2 data-reveal='up' className='text-h2_semibold'>
              {title}
            </h2>
          )}
          {subtitle && (
            <p data-reveal='up' className={cn('text-h2_light mt-3', subtitleStyles[bg])}>
              {subtitle}
            </p>
          )}
        </div>
        {badge && (
          <span className={cn('text-body_semibold shrink-0 italic', badgeStyles[bg])}>{badge}</span>
        )}
      </div>

      {/* Challenges Grid */}
      <div
        data-reveal-stagger='up'
        className={cn(
          'mx-auto grid max-w-6xl gap-x-8 gap-y-10',
          challenges.length <= 2 && 'grid-cols-1 sm:grid-cols-2',
          challenges.length === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
          challenges.length >= 4 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        )}
      >
        {challenges.map((challenge, index) => {
          const img = getImagePayloadUrl(challenge.icon);

          return (
            <div
              key={challenge.id || index}
              className='flex flex-col items-center gap-5 text-center'
            >
              {/* Icon image with optional highlight value overlay */}
              <div className='relative h-32 w-39 rounded-xl'>
                {img ? (
                  <ImageMedia
                    src={img.url}
                    alt={img.alt ?? ''}
                    fill
                    className='object-contain'
                    sizes='(max-width: 768px) 100vw, 33vw'
                  />
                ) : (
                  <div className='bg-bege-dark mx-auto aspect-square h-full rounded-full' />
                )}
              </div>

              {/* Label */}
              <p className='text-body_semibold max-w-56 leading-snug text-balance'>
                {challenge.label}
              </p>
            </div>
          );
        })}
      </div>
    </HawkStarsSection>
  );
};
