import React from 'react';
import { cn } from '@/lib/utils';
import { getImagePayloadUrl } from '@/lib/image';
import { ImageMedia } from '@/payload/components/Media';
import type { GrowthVisionBlock as GrowthVisionBlockType } from '@/payload-types';
import { HawkStarsSection } from '@/components/layout';
import SectionHeader from '@/components/ui/SectionHeader';

const backgroundStyles = {
  white: 'bg-white text-black',
  bege: 'bg-bege-light text-black',
  green: 'bg-green text-white',
} as const;

const phaseNameStyles = {
  white: 'text-black',
  bege: 'text-black',
  green: 'text-white',
} as const;

// Plain alignment: the old `ml-40`/`mr-40` offsets pushed the title off the shared content
// column that every other section lines up on.
const titleLocationStyles = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const;

export const GrowthVisionBlock: React.FC<GrowthVisionBlockType> = ({
  title,
  background = 'bege',
  phases = [],
  titleLocation = 'center',
  sectionId,
}) => {
  if (!phases || phases.length === 0) return null;

  const bg = (background ?? 'bege') as keyof typeof backgroundStyles;

  return (
    <HawkStarsSection
      spacing='default'
      padding='none'
      cap='none'
      container
      className={cn(backgroundStyles[bg])}
      id={sectionId || undefined}
      data-blockid='growthVisionBlock'
    >
      {title && (
        <SectionHeader
          reveal
          title={title}
          align={titleLocation === 'center' ? 'center' : 'left'}
          variant={bg === 'green' ? 'inverse' : 'green'}
          className={cn('mb-10 md:mb-12 lg:mb-14', titleLocationStyles[titleLocation ?? 'center'])}
        />
      )}

      {/* Phases — zigzag on desktop, stacked image-then-text on mobile. Text stays
          left-aligned on both so the item lists scan down one edge. */}
      <ol data-reveal-stagger='up' className='mx-auto flex max-w-5xl flex-col gap-12 lg:gap-16'>
        {phases.map((phase, index) => {
          const isEven = index % 2 === 0;
          const img = getImagePayloadUrl(phase.icon);

          return (
            <li
              key={phase.id || index}
              className={cn(
                'flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-12',
                !isEven && 'lg:flex-row-reverse'
              )}
            >
              {img && (
                <div className='flex flex-1 items-center justify-center'>
                  <ImageMedia
                    src={img.url}
                    alt={img.alt ?? ''}
                    height={300}
                    width={450}
                    className='aspect-video h-auto w-full max-w-md rounded-xl object-contain'
                  />
                </div>
              )}
              {!img && <div aria-hidden='true' className='hidden flex-1 lg:block' />}

              <div className='flex-1'>
                <h3 className={cn('text-h2_bold mb-4', phaseNameStyles[bg])}>{phase.phaseName}</h3>
                <ul className='text-body_regular max-w-prose space-y-2'>
                  {phase.items?.map((item, itemIndex) => (
                    <li key={item.id || itemIndex} className='flex items-start gap-3'>
                      <span
                        aria-hidden='true'
                        className='mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60'
                      />
                      <span className='opacity-90'>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>
    </HawkStarsSection>
  );
};
