import React from 'react';
import Image from 'next/image';

import type { GlobalVillageAboutSectionBlock as GlobalVillageAboutSectionBlockProps } from '@/payload-types';

import { getImagePayloadUrl } from '@/lib/image';
import { HawkStarsSection } from '@/components/layout';
import RichText from '@/payload/components/RichText';
import { CMSLink } from '@/payload/components/Link';

export const GlobalVillageAboutSectionBlockComponent: React.FC<
  GlobalVillageAboutSectionBlockProps
> = ({ heading, description, sections, cta, sectionId }) => {
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <HawkStarsSection
      spacing='none'
      padding='none'
      id={sectionId || undefined}
      data-blockId='globalVillageAboutSection'
    >
      <div className='mx-auto mb-12 flex max-w-6xl flex-col gap-6 px-4 pt-16 text-center sm:px-6 md:pt-20 lg:mb-14 lg:px-8 lg:pt-24'>
        {heading && <h2 className='text-h1_semibold tracking-tight text-balance'>{heading}</h2>}
        {description && <p className='text-body_regular leading-relaxed'>{description}</p>}
      </div>

      <div className='bg-bege-light section'>
        <div className='mx-3 flex max-w-6xl flex-col gap-8 lg:mx-auto lg:flex-row'>
          {sections.map((section, index) => {
            const imageData = section.sectionImage
              ? getImagePayloadUrl(section.sectionImage)
              : null;
            const key = section.id ?? `section-${index}`;

            return (
              <div className='flex flex-1 flex-col gap-5' key={key}>
                {imageData?.url && (
                  <Image
                    src={imageData.url}
                    alt={imageData.alt || section.title || 'Section image'}
                    width={imageData.width ?? 800}
                    height={imageData.height ?? 400}
                    className='w-full rounded-lg object-cover lg:h-52'
                  />
                )}

                {section.title && (
                  <h3 className='text-body_semibold text-left lg:text-lg'>{section.title}</h3>
                )}

                {section.content && (
                  <RichText data={section.content} className='text-body_regular' />
                )}
              </div>
            );
          })}
        </div>

        {cta?.enable && cta.link?.label && (
          <div className='mt-10 flex justify-center'>
            <CMSLink
              {...cta.link}
              appearance='inline'
              className='border-green bg-green w-fit cursor-pointer rounded-xl border px-4 py-3 text-center text-white focus:ring-0 focus:outline-hidden'
            />
          </div>
        )}
      </div>
    </HawkStarsSection>
  );
};
