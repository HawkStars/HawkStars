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

  const isDark = backgroundColor === 'gradient';

  const bgClasses = {
    white: 'bg-white',
    gray: 'bg-bege-light',
    gradient: 'bg-gradient-to-br from-green to-green-dark text-white',
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
            'mb-10 md:mb-12 lg:mb-14',
            textAlign && textAlignClasses[textAlign as keyof typeof textAlignClasses]
          )}
        >
          {title && <h2 className='text-h2_semibold'>{title}</h2>}
          {subtitle && (
            <p
              className={cn(
                'text-h2_light mt-4 max-w-2xl',
                textAlign === 'center' && 'mx-auto',
                textAlign === 'right' && 'ml-auto',
                isDark ? 'text-white/85' : 'text-black/70'
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}
      <ul className='grid grid-cols-2 md:grid-cols-4'>
        {stats.map((stat, index) => {
          const isLast = index === stats.length - 1;
          const lastRowStart = (n: number) => stats.length - (stats.length % n || n);
          return (
            <li
              key={stat.id ?? index}
              className={cn(
                'flex flex-col items-center justify-center gap-2 px-4 py-8 text-center lg:px-6',
                isDark ? 'border-white/20' : 'border-bege-dark',
                // Hairline dividers between cells only — never on the outer edge — for the
                // 2-column mobile grid and the 4-column grid from md up.
                index % 2 === 0 && !isLast && 'border-r',
                index < lastRowStart(2) && 'border-b',
                index % 4 !== 3 && !isLast ? 'md:border-r' : 'md:border-r-0',
                index < lastRowStart(4) ? 'md:border-b' : 'md:border-b-0'
              )}
            >
              <span
                className={cn(
                  'font-display text-5xl leading-none font-semibold lg:text-6xl',
                  !isDark && 'text-green'
                )}
              >
                {stat.value}
              </span>
              <span
                className={cn(
                  'text-eyebrow max-w-40 leading-snug',
                  isDark ? 'text-white/80' : 'text-black/60'
                )}
              >
                {stat.label}
              </span>
            </li>
          );
        })}
      </ul>
    </HawkStarsSection>
  );
};
