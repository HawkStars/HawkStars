import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getImagePayloadUrl } from '@/lib/image';
import type { ImageType } from '@/payload-types';

type PhaseItem = {
  text: string;
  id?: string | null;
};

type Phase = {
  icon: ImageType;
  phaseName: string;
  items: PhaseItem[];
  id?: string | null;
};

type GrowthVisionBlockProps = {
  id?: string | null;
  blockName?: string | null;
  blockType?: string;
  title?: string | null;
  subtitle?: string | null;
  background?: 'white' | 'bege' | 'green' | null;
  phases: Phase[];
  sectionId?: string | null;
};

const backgroundStyles = {
  white: 'bg-white text-black',
  bege: 'bg-bege-light text-black',
  green: 'bg-green text-white',
} as const;

const iconBgStyles = {
  white: 'bg-bege-light',
  bege: 'bg-white',
  green: 'bg-white/10',
} as const;

const phaseNameStyles = {
  white: 'text-green',
  bege: 'text-green',
  green: 'text-white',
} as const;

const dotStyles = {
  white: 'bg-green',
  bege: 'bg-green',
  green: 'bg-white',
} as const;

const lineStyles = {
  white: 'border-gray-light',
  bege: 'border-bege-dark',
  green: 'border-white/20',
} as const;

export const GrowthVisionBlock: React.FC<GrowthVisionBlockProps> = ({
  title,
  subtitle,
  background = 'bege',
  phases = [],
  sectionId,
}) => {
  if (!phases || phases.length === 0) {
    return null;
  }

  const bg = (background ?? 'bege') as keyof typeof backgroundStyles;

  return (
    <section className={cn('py-12 lg:py-20', backgroundStyles[bg])} id={sectionId || ''}>
      <div className='container mx-auto px-4'>
        {/* Header */}
        <div className='mb-12 text-center'>
          {title && <h2 className='text-3xl font-bold lg:text-4xl'>{title}</h2>}
          {subtitle && (
            <p className={cn('mt-2 text-lg font-medium lg:text-xl', phaseNameStyles[bg])}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Phases — zigzag layout */}
        <div className='relative mx-auto max-w-4xl space-y-12 lg:space-y-16'>
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
                    'relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl lg:h-24 lg:w-24',
                    iconBgStyles[bg]
                  )}
                >
                  {img ? (
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      className='rounded-2xl object-contain p-2'
                    />
                  ) : (
                    <div className='h-full w-full rounded-2xl bg-gray-200' />
                  )}
                </div>

                {/* Content */}
                <div className={cn('flex-1 text-center lg:text-left', !isEven && 'lg:text-right')}>
                  <h3 className={cn('mb-3 text-xl font-bold lg:text-2xl', phaseNameStyles[bg])}>
                    {phase.phaseName}
                  </h3>
                  <ul className={cn('space-y-2', !isEven && 'lg:ml-auto')}>
                    {phase.items?.map((item, itemIndex) => (
                      <li
                        key={item.id || itemIndex}
                        className={cn(
                          'flex items-start gap-2',
                          'justify-center lg:justify-start',
                          !isEven && 'lg:justify-end'
                        )}
                      >
                        <span
                          className={cn('mt-2 h-1.5 w-1.5 shrink-0 rounded-full', dotStyles[bg])}
                        />
                        <span className='text-sm opacity-80 lg:text-base'>{item.text}</span>
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
