import React from 'react';
import Image from 'next/image';
import type { TimelineBlock as TimelineBlockProps } from '@/payload-types';
import { cn } from '@/lib/utils';
import { getImagePayloadUrl } from '@/lib/image';
import { HawkStarsSection } from '@/components/layout';

export const TimelineBlock: React.FC<TimelineBlockProps> = ({
  title,
  items = [],
  orientation = 'vertical',
  sectionId,
  blockType = 'timeline',
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <HawkStarsSection
      spacing='default'
      padding='none'
      container
      id={sectionId || undefined}
      data-blockId={blockType}
    >
      {title && (
        <h2 className='mb-12 text-center text-3xl font-bold tracking-tight text-balance lg:text-4xl'>
          {title}
        </h2>
      )}

      {orientation === 'vertical' && (
        <div className='relative'>
          {/* Center line */}
          <div className='absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gray-300 to-transparent' />

          {items.map((item, index) => (
            <div
              key={index}
              className={cn(
                'relative mb-16 flex items-start',
                index % 2 === 0 ? 'justify-start' : 'justify-end'
              )}
            >
              <div className={cn('w-5/12', index % 2 === 0 ? 'pr-14 text-right' : 'pl-14')}>
                <div className='card-md overflow-hidden'>
                  <div className='bg-bege-light border-b border-gray-100 px-6 py-3'>
                    <h3 className='text-base font-bold text-gray-900'>{item.title}</h3>
                  </div>
                  <div className='p-6'>
                    <p className='leading-relaxed text-gray-700'>{item.description}</p>
                    {item.image && (
                      <div className='relative mt-4 h-48 w-full overflow-hidden rounded-lg'>
                        <Image
                          src={getImagePayloadUrl(item.image)?.url || ''}
                          alt={item.title}
                          fill
                          className='object-cover'
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Year badge on the center line */}
              <div className='absolute left-1/2 z-10 -translate-x-1/2'>
                <div className='bg-green flex h-14 w-14 items-center justify-center rounded-full text-white shadow-md ring-4 ring-white'>
                  <span className='text-[10px] leading-tight font-extrabold tracking-tight'>
                    {item.year}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {orientation === 'horizontal' && (
        <div className='overflow-x-auto pb-4'>
          <div className='relative flex min-w-max gap-0'>
            {/* Horizontal connecting line */}
            <div className='absolute top-6 right-0 left-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent' />
            {items.map((item, index) => (
              <div key={index} className='w-72 shrink-0 px-4'>
                {/* Year dot */}
                <div className='relative mb-8 flex justify-center'>
                  <div className='bg-green flex h-12 w-12 items-center justify-center rounded-full text-white shadow-md ring-4 ring-white'>
                    <span className='text-[9px] leading-tight font-extrabold tracking-tight'>
                      {item.year}
                    </span>
                  </div>
                </div>
                <div className='card-md overflow-hidden'>
                  <div className='bg-bege-light border-b border-gray-100 px-5 py-3'>
                    <h3 className='text-sm font-bold text-gray-900'>{item.title}</h3>
                  </div>
                  <div className='p-5'>
                    <p className='text-sm leading-relaxed text-gray-700'>{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </HawkStarsSection>
  );
};
