import React from 'react';
import type { SocialProofBlock as SocialProofBlockProps } from '@/payload-types';
import { cn } from '@/lib/utils';
import { HawkStarsSection } from '@/components/layout';

const textAlignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const;

export const SocialProofBlock: React.FC<SocialProofBlockProps> = ({
  stats = [],
  backgroundColor = 'white',
  textAlign = 'center',
  title,
  subtitle,
  sectionId,
}) => {
  if (!stats || stats.length === 0) return null;

  const bgClasses = {
    white: 'bg-white',
    gray: 'bg-bege-light',
    gradient: 'bg-gradient-to-br from-green to-bege-dark text-white',
  };

  return (
    <HawkStarsSection
      spacing='tight'
      padding='none'
      cap='none'
      container
      className={cn(bgClasses[backgroundColor as keyof typeof bgClasses])}
      id={sectionId || undefined}
      data-blockid='socialProof'
    >
      {(title || subtitle) && (
        <div
          className={cn(
            'mb-10 md:mb-12',
            textAlign && textAlignClasses[textAlign as keyof typeof textAlignClasses]
          )}
        >
          {title && (
            <h2 className='mb-3 text-3xl font-bold tracking-tight text-balance lg:text-4xl'>
              {title}
            </h2>
          )}
          {subtitle && <p className={cn('text-lg opacity-80 lg:text-xl')}>{subtitle}</p>}
        </div>
      )}
      <div className='grid grid-cols-2 md:grid-cols-4'>
        {stats.map((stat, index) => (
          <div
            key={index}
            className={cn(
              'flex flex-col items-center justify-center px-6 py-8 text-center',
              index !== stats.length - 1 && [
                'border-r border-b md:border-b-0',
                backgroundColor === 'gradient' ? 'border-white/20' : 'border-gray-200',
                index % 2 !== 1 ? '' : 'md:border-r-0',
              ]
            )}
          >
            <div className='mb-2 text-4xl font-extrabold tracking-tight lg:text-5xl'>
              {stat.value}
            </div>
            <div
              className={cn(
                'max-w-[120px] text-xs leading-snug font-semibold tracking-wider uppercase',
                backgroundColor === 'gradient' ? 'opacity-75' : 'text-gray-500'
              )}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </HawkStarsSection>
  );
};
