import React from 'react';

import type { CallToActionBlock as CTABlockProps } from '@/payload-types';

import { CMSLink } from '@/payload/components/Link';
import { Globe } from '@/components/magicui/globe';

export const CallToActionBlock: React.FC<CTABlockProps> = ({ title, subtitle, links }) => {
  return (
    <section className='py-32'>
      <div className='container mx-auto'>
        <div className='bg-muted relative flex h-92 w-full flex-col justify-between overflow-hidden rounded-4xl border p-8 md:flex-row'>
          <div className='flex h-full max-w-lg flex-col justify-center gap-4'>
            <h1 className='text-4xl font-medium tracking-tighter md:text-6xl'>{title}</h1>
            <p className='text-muted-foreground/70'>{subtitle}</p>

            <div className='flex gap-4'>
              {(links || []).map(({ link }, i) => {
                return (
                  <CMSLink
                    key={i}
                    size='lg'
                    {...link}
                    className='bg-background text-foreground hover:bg-background group relative z-10 w-fit rounded-full! border border-none px-10 tracking-tighter shadow-none!'
                  />
                );
              })}
            </div>
          </div>
          <div className='relative size-full'>
            <Globe className='absolute top-0 md:top-10 md:-right-100 md:scale-150' />
          </div>
        </div>
      </div>
    </section>
  );
};
