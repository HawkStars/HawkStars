'use client';

import { Asterisk, CornerDownRight } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import type { ProcessOneBlock as ProcessOneBlockProps } from '@/payload-types';

export const ProcessOneBlock: React.FC<ProcessOneBlockProps> = ({
  title = 'Our Process',
  description,
  ctaText = 'Get in touch',
  steps = [],
}) => {
  if (!steps || steps.length === 0) return null;

  return (
    <section className='py-32'>
      <div className='container mx-auto'>
        <div className='grid grid-cols-1 gap-5 lg:grid-cols-6 lg:gap-20'>
          <div className='top-10 col-span-2 h-fit w-fit gap-3 space-y-7 py-8 lg:sticky'>
            <div className='relative w-fit text-5xl font-semibold tracking-tight lg:text-7xl'>
              <h1 className='w-fit'>{title}</h1>
              <Asterisk className='text-green absolute -top-2 -right-2 size-5 md:size-10 lg:-right-14' />
            </div>
            {description && <p className='text-foreground/50 text-base'>{description}</p>}
            <Button variant='ghost' className='flex items-center justify-start gap-2'>
              <CornerDownRight className='text-green' />
              {ctaText}
            </Button>
          </div>
          <ul className='relative col-span-4 w-full lg:pl-22'>
            {steps.map((step, index) => (
              <li
                key={index}
                className='relative flex flex-col gap-10 border-t py-8 md:flex-row lg:py-10'
              >
                <Illustration className='absolute top-4 right-0' />
                <div className='bg-muted flex size-12 items-center justify-center px-4 py-1 tracking-tighter'>
                  {step.step}
                </div>
                <div className=''>
                  <h3 className='mb-4 text-2xl font-semibold tracking-tighter lg:text-3xl'>
                    {step.title}
                  </h3>
                  <p className='text-foreground/50'>{step.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

const Illustration = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width='22'
      height='20'
      viewBox='0 0 22 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <line x1='0.607422' y1='2.57422' x2='21.5762' y2='2.57422' stroke='#0A7558' strokeWidth='4' />
      <line x1='19.5762' y1='19.624' x2='19.5762' y2='4.57422' stroke='#0A7558' strokeWidth='4' />
    </svg>
  );
};
