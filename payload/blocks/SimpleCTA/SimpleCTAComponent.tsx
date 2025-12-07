import React from 'react';

import type { SimpleCTABlock } from '@/payload-types';

import { Button } from '@/components/ui/button';

export const SimpleCTABlockComponent: React.FC<SimpleCTABlock> = ({
  heading,
  description,
  buttons,
}) => {
  return (
    <section className='py-32'>
      <div className='container mx-auto'>
        <div className='bg-accent rounded-lg p-8 md:rounded-xl lg:p-12'>
          <div className='max-w-4xl'>
            <h3 className='mb-4 text-3xl font-semibold md:text-5xl lg:mb-6 lg:text-6xl'>
              {heading}
            </h3>
            <p className='text-muted-foreground mb-8 text-lg font-medium lg:text-xl'>
              {description}
            </p>
            <div className='flex flex-col gap-3 sm:flex-row sm:gap-4'>
              {buttons?.primary?.text && buttons?.primary?.url && (
                <Button size='lg' className='w-full sm:w-auto' asChild>
                  <a href={buttons.primary.url}>{buttons.primary.text}</a>
                </Button>
              )}
              {buttons?.secondary?.text && buttons?.secondary?.url && (
                <Button variant='outline' size='lg' className='w-full sm:w-auto' asChild>
                  <a href={buttons.secondary.url}>{buttons.secondary.text}</a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
