import React from 'react';
import Image from 'next/image';

import type { GlobalVillageAboutSectionBlock as GlobalVillageAboutSectionBlockProps } from '@/payload-types';

import { getImagePayloadUrl } from '@/lib/image';
import RichText from '@/payload/components/RichText';
import { CMSLink } from '@/payload/components/Link';

export const GlobalVillageAboutSectionBlockComponent: React.FC<
  GlobalVillageAboutSectionBlockProps
> = ({ heading, description, sections, cta }) => {
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <section>
      <div className='mx-3 mb-10 flex max-w-6xl flex-col gap-6 px-0 text-center lg:mx-auto lg:px-8'>
        {heading && <h2 className='text-body_semibold lg:text-h1_semibold'>{heading}</h2>}
        {description && <p className='text-body_regular'>{description}</p>}
      </div>

      <div className='bg-bege-light py-20'>
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
    </section>
  );
};
