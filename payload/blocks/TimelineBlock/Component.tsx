import React from 'react';
import Image from 'next/image';
import type { TimelineBlock as TimelineBlockProps, Media } from '@/payload-types';
import { cn } from '@/lib/utils';

export const TimelineBlock: React.FC<TimelineBlockProps> = ({
  title,
  items = [],
  orientation = 'vertical',
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className='py-12 lg:py-20'>
      <div className='container mx-auto'>
        {title && <h2 className='mb-12 text-center text-3xl font-bold lg:text-4xl'>{title}</h2>}

        {orientation === 'vertical' && (
          <div className='relative'>
            <div className='absolute top-0 bottom-0 left-1/2 w-0.5 -translate-x-1/2 bg-gray-300' />

            {items.map((item, index) => (
              <div
                key={index}
                className={cn(
                  'relative mb-12 flex items-center',
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                )}
              >
                <div className={cn('w-5/12', index % 2 === 0 ? 'pr-12 text-right' : 'pl-12')}>
                  <div className='rounded-lg bg-white p-6 shadow-md'>
                    <div className='mb-2 text-2xl font-bold text-green-600'>{item.year}</div>
                    <h3 className='mb-2 text-xl font-semibold'>{item.title}</h3>
                    <p className='text-gray-700'>{item.description}</p>
                    {item.image && typeof item.image !== 'string' && (
                      <div className='relative mt-4 h-48 w-full overflow-hidden rounded-lg'>
                        <Image
                          src={(item.image as Media).url || ''}
                          alt={item.title}
                          fill
                          className='object-cover'
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className='absolute left-1/2 z-10 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white bg-green-600 text-white shadow-md' />
              </div>
            ))}
          </div>
        )}

        {orientation === 'horizontal' && (
          <div className='overflow-x-auto'>
            <div className='flex min-w-max gap-8 pb-4'>
              {items.map((item, index) => (
                <div key={index} className='w-80 shrink-0'>
                  <div className='mb-4 text-center text-2xl font-bold text-green-600'>
                    {item.year}
                  </div>
                  <div className='rounded-lg bg-white p-6 shadow-md'>
                    <h3 className='mb-2 text-xl font-semibold'>{item.title}</h3>
                    <p className='text-gray-700'>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
