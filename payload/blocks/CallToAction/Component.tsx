import React from 'react';

import type { CallToActionBlock as CTABlockProps } from '@/payload-types';

import { CMSLink } from '@/payload/components/Link';
import { ImageMedia } from '@/payload/components/Media';
import { getImagePayloadUrl } from '@/lib/image';
import { HawkStarsSection } from '@/components/layout';

export const CallToActionBlock: React.FC<CTABlockProps> = ({
  title,
  subtitle,
  links,
  image,
  sectionId,
}) => {
  const imageInfo = getImagePayloadUrl(image);

  return (
    <HawkStarsSection
      spacing='loose'
      padding='none'
      container
      id={sectionId || undefined}
      data-blockid='cta'
    >
      <div className='bg-muted relative flex w-full flex-col justify-between gap-8 overflow-hidden rounded-4xl border p-8 md:flex-row md:items-center md:gap-12 md:p-12'>
        <div className='flex h-full max-w-lg flex-col justify-center'>
          <h1 className='text-4xl font-medium tracking-tighter text-balance md:text-6xl'>
            {title}
          </h1>
          {subtitle && <p className='text-muted-foreground/70 mt-4 leading-relaxed'>{subtitle}</p>}

          {links && links.length > 0 && (
            <div className='mt-8 flex flex-wrap gap-4'>
              {links.map(({ link }, i) => {
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
          )}
        </div>
        {imageInfo && (
          <div className='relative h-72 w-full shrink-0 overflow-hidden rounded-4xl md:h-92 md:w-1/2'>
            <ImageMedia src={imageInfo.url} alt={imageInfo.alt || ''} fill className='object-cover' />
          </div>
        )}
      </div>
    </HawkStarsSection>
  );
};
