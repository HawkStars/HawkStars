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
      container
      className={cn(backgroundStyles[bg])}
      id={sectionId || undefined}
      data-blockid='whyHereWhyNowBlock'
    >
      {/* Header */}
      <div className='mb-12 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between lg:mb-14'>
        <div>
          {title && <h2 className='text-h1_semibold tracking-tight text-balance'>{title}</h2>}
          {subtitle && <p className='text-body_semibold mt-3 leading-relaxed'>{subtitle}</p>}
        </div>
        {badge && (
          <span className={cn('text-body_semibold shrink-0 italic', badgeStyles[bg])}>{badge}</span>
        )}
      </div>

      {/* Challenges Grid */}
      <div
        className={cn(
          'mx-auto grid max-w-6xl gap-8',
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
              className='flex flex-col items-center gap-6 text-center'
            >
              {/* Icon image with optional highlight value overlay */}
              <div className='relative h-32 w-39 rounded-3xl'>
                {img ? (
                  <ImageMedia
                    src={img.url}
                    alt={img.alt ?? ''}
                    fill
                    className='object-contain'
                    sizes='(max-width: 768px) 100vw, 33vw'
                  />
                ) : (
                  <div className='h-full w-full rounded-full bg-gray-200' />
                )}
              </div>

              {/* Label */}
              <p className='text-body_semibold max-w-50 text-center leading-snug'>
                {challenge.label}
              </p>
            </div>
          );
        })}
      </div>
    </HawkStarsSection>
  );
};
