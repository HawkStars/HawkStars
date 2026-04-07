import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getImagePayloadUrl } from '@/lib/image';
import type { GrowthVisionBlock as GrowthVisionBlockType } from '@/payload-types';

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

const titleLocationStyles = {
  left: 'text-left ml-40 max-lg:ml-1',
  center: 'text-center',
  right: 'text-right mr-40 max-lg:mr-1',
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
    <section className={cn('py-12 lg:py-20', backgroundStyles[bg])} id={sectionId || ''}>
      <div className='container mx-auto px-4'>
        {/* Header */}
        <div className={cn('mb-12', titleLocationStyles[titleLocation ?? 'center'])}>
          {title && <h2 className='text-h1_semibold'>{title}</h2>}
        </div>

        {/* Phases — zigzag layout */}
        <div className='mx-auto flex max-w-5xl flex-col gap-12 lg:gap-16'>
          {phases.map((phase, index) => {
            const isEven = index % 2 === 0;
            const img = getImagePayloadUrl(phase.icon);

            return (
              <div
                key={phase.id || index}
                className={cn(
                  'relative z-10 flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:gap-12',
                  !isEven && 'lg:flex-row-reverse'
                )}
              >
                {/* Icon image */}
                <div
                  className={cn(
                    'relative flex flex-1 shrink-0 items-center justify-center rounded-4xl'
                  )}
                >
                  {img ? (
                    <Image
                      src={img.url}
                      alt={img.alt}
                      height={300}
                      width={450}
                      className='aspect-video rounded-2xl object-contain'
                    />
                  ) : (
                    <div className='h-full w-full' />
                  )}
                </div>

                {/* Content */}
                <div
                  className={cn(
                    'text-h2_bold flex-1 pt-5 text-center lg:text-left',
                    !isEven && 'lg:text-right'
                  )}
                >
                  <h3 className={cn('text-h2_bold mb-3 lg:text-start', phaseNameStyles[bg])}>
                    {phase.phaseName}
                  </h3>
                  <ul className={cn('text-body_regular space-y-1', !isEven && 'lg:ml-auto')}>
                    {phase.items?.map((item, itemIndex) => (
                      <li
                        key={item.id || itemIndex}
                        className={cn('flex list-none items-start justify-center lg:justify-start')}
                      >
                        <span className='text-sm opacity-80'>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
