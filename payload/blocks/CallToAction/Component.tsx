import React from 'react';

import type { CallToActionBlock as CTABlockProps } from '@/payload-types';

import { CMSLink } from '@/payload/components/Link';
import { ImageMedia } from '@/payload/components/Media';
import { getImagePayloadUrl } from '@/lib/image';
import { HawkStarsSection } from '@/components/layout';
import { Language } from '@/i18n/settings';

export const CallToActionBlock = ({
  title,
  subtitle,
  links,
  image,
  sectionId,
  lng,
}: CTABlockProps & { lng: Language }) => {
  const imageInfo = getImagePayloadUrl(image);

  return (
    <HawkStarsSection
      spacing='loose'
      padding='none'
      cap='none'
      container
      id={sectionId || undefined}
      data-blockid='cta'
    >
      <div className='bg-bege-light border-bege-dark relative flex w-full flex-col justify-between gap-8 overflow-hidden rounded-xl border p-6 shadow-sm sm:p-8 md:flex-row md:items-center md:gap-12 lg:p-12'>
        <div className='flex h-full max-w-xl flex-col justify-center'>
          <h2 data-reveal='up' className='text-h2_semibold'>
            {title}
          </h2>
          {subtitle && <p className='mt-4 text-lg leading-relaxed text-black/70'>{subtitle}</p>}

          {links && links.length > 0 && (
            <div className='mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4'>
              {links.map(({ link }, i) => (
                // First link is the primary action; any others step down to outline.
                <CMSLink
                  lng={lng}
                  key={i}
                  {...link}
                  appearance={i === 0 ? 'default' : 'outline'}
                  size='lg'
                />
              ))}
            </div>
          )}
        </div>
        {imageInfo && (
          <div className='relative aspect-4/3 w-full shrink-0 overflow-hidden rounded-xl md:aspect-auto md:h-92 md:w-1/2'>
            <ImageMedia
              src={imageInfo.url}
              alt={imageInfo.alt || ''}
              fill
              sizes='(min-width: 768px) 50vw, 100vw'
              className='object-cover'
            />
          </div>
        )}
      </div>
    </HawkStarsSection>
  );
};
