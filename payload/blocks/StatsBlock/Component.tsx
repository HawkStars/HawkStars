'use client';

import NumberFlow from '@number-flow/react';
import { ArrowRight, RefreshCcw } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

// Import the generated type from Payload (adjust path if needed)
import type { StatsBlock as StatsBlockType } from '@/payload-types';

export const StatsBlock: React.FC<StatsBlockType> = ({
  heading,
  description,
  ctaButtonText,
  primaryStat,
  secondaryText,
  toggleButtonText,
  stats,
}) => {
  const [showMonthlyStats, setShowMonthlyStats] = useState(false);
  const ref = useRef(null);

  return (
    <section className='py-32'>
      <div className='container mx-auto flex justify-center'>
        <div className='flex w-full flex-col justify-between gap-4 lg:flex-row'>
          <div className='w-full lg:w-1/3'>
            {heading && <h1 className='font-calSans w-full text-6xl font-medium'>{heading}</h1>}
            {description && (
              <p className='text-muted-foreground my-4 text-lg tracking-tight'>{description}</p>
            )}
            {ctaButtonText && (
              <Button
                variant='secondary'
                className='text-md group mt-10 flex w-fit items-center justify-center gap-2 rounded-full px-6 py-1 tracking-tight shadow-none'
              >
                <span>{ctaButtonText}</span>
                <ArrowRight className='size-4 -rotate-45 transition-all ease-out group-hover:ml-3 group-hover:rotate-0' />
              </Button>
            )}
            <div className='mt-10 lg:w-[115%]'></div>
          </div>
          <div ref={ref} className='flex w-full flex-col items-end lg:w-1/2'>
            {primaryStat && (
              <h1 className='font-calSans text-8xl leading-0 lg:text-[10rem]'>
                <NumberFlow
                  value={showMonthlyStats ? primaryStat.monthlyValue : primaryStat.yearlyValue}
                  prefix={primaryStat.prefix || ''}
                  suffix={primaryStat.suffix || ''}
                  className='font-calSans'
                />
              </h1>
            )}
            <div className='mb-6 flex flex-col items-center justify-center gap-6 lg:flex-row lg:gap-17'>
              {secondaryText && <p>{secondaryText}</p>}
              {toggleButtonText && (
                <Button
                  variant='secondary'
                  className='text-md group flex w-fit items-center justify-center gap-2 rounded-full px-6 py-1 tracking-tight shadow-none transition-all duration-300 ease-out active:scale-95'
                  onClick={() => setShowMonthlyStats(!showMonthlyStats)}
                >
                  <span>{toggleButtonText}</span>
                  <RefreshCcw className='size-4 -rotate-45 transition-all ease-out group-hover:ml-3 group-hover:rotate-0' />
                </Button>
              )}
            </div>
            <div className='mt-auto mb-10 grid w-full grid-cols-2 gap-14'>
              {stats &&
                stats.map((stat, idx) => (
                  <div key={idx} className={idx % 2 === 0 ? 'text-left' : 'text-right'}>
                    <h2 className='text-4xl font-medium lg:text-6xl'>
                      <NumberFlow
                        value={showMonthlyStats ? stat.monthlyValue : stat.yearlyValue}
                        prefix={stat.prefix || ''}
                        suffix={stat.suffix || ''}
                      />
                    </h2>
                    <p className='text-muted-foreground/70'> {stat.label} </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
