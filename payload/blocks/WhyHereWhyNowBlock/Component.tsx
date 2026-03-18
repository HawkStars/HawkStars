import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getImagePayloadUrl } from '@/lib/image';
import type { ImageType } from '@/payload-types';

type Challenge = {
  icon: ImageType;
  highlightValue?: string | null;
  label: string;
  id?: string | null;
};

type WhyHereWhyNowBlockProps = {
  id?: string | null;
  blockName?: string | null;
  blockType?: string;
  title?: string | null;
  subtitle?: string | null;
  badge?: string | null;
  background?: 'white' | 'bege' | 'green' | null;
  challenges: Challenge[];
  sectionId?: string | null;
};

const backgroundStyles = {
  white: 'bg-white text-black',
  bege: 'bg-bege-light text-black',
  green: 'bg-green text-white',
} as const;

const badgeStyles = {
  white: 'text-green',
  bege: 'text-green',
  green: 'text-white/80',
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
    <section className={cn('py-12 lg:py-20', backgroundStyles[bg])} id={sectionId || ''}>
      <div className='container mx-auto px-4'>
        {/* Header */}
        <div className='mb-12 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
          <div>
            {title && <h2 className='text-h1_semibold'>{title}</h2>}
            {subtitle && <p className='text-body_semibold mt-3'>{subtitle}</p>}
          </div>
          {badge && (
            <span className={cn('text-body_semibold shrink-0 italic', badgeStyles[bg])}>
              {badge}
            </span>
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
                    <Image src={img.url} alt={img.alt} fill className='object-contain' />
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
      </div>
    </section>
  );
};
