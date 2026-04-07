import React from 'react';

import type { CallToActionBlock as CTABlockProps } from '@/payload-types';

import { CMSLink } from '@/payload/components/Link';
import Image from 'next/image';
import { getImagePayloadUrl } from '@/lib/image';

export const CallToActionBlock: React.FC<CTABlockProps> = ({
  title,
  subtitle,
  links,
  image,
  sectionId,
}) => {
  const imageInfo = getImagePayloadUrl(image);

  return (
    <section className='py-32' id={sectionId || ''}>
      <div className='container mx-auto max-lg:px-2'>
        <div className='bg-muted relative flex w-full flex-col justify-between overflow-hidden rounded-4xl border p-8 md:flex-row'>
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
                    className='text-foreground hover:bg-background group border-green relative z-10 w-fit rounded-full! border px-10 py-4 tracking-tighter shadow-none!'
                  />
                );
              })}
            </div>
          </div>
          {imageInfo && (
            <div className='relative ml-5 size-full h-92 rounded-4xl'>
              <Image src={imageInfo.url} alt={imageInfo.alt || ''} fill className='object-cover' />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
