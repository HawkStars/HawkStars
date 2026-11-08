import React from 'react';

import type { GlobalVillageAboutSectionBlock as GlobalVillageAboutSectionBlockProps } from '@/payload-types';

import { getImagePayloadUrl } from '@/lib/image';
import { ImageMedia } from '@/payload/components/Media';
import { HawkStarsSection } from '@/components/layout';
import SectionHeader from '@/components/ui/SectionHeader';
import RichText from '@/payload/components/RichText';
import { CMSLink } from '@/payload/components/Link';
import { Language } from '@/i18n/settings';

export const GlobalVillageAboutSectionBlockComponent: React.FC<
  GlobalVillageAboutSectionBlockProps & { lng: Language }
> = ({ heading, description, sections, cta, sectionId, lng }) => {
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <>
      {heading && (
        <HawkStarsSection
          spacing='default'
          className='pb-0 md:pb-0 lg:pb-0'
          id={sectionId || undefined}
          data-blockid='globalVillageAboutSection'
        >
          <SectionHeader
            reveal
            title={heading}
            subtitle={description ?? undefined}
            align='center'
            className='section-header'
            subtitleClassName='max-w-2xl'
          />
        </HawkStarsSection>
      )}

      <HawkStarsSection
        spacing='default'
        className='bg-bege-light'
        // With no heading, the band itself carries the anchor and block id.
        id={heading ? undefined : sectionId || undefined}
        data-blockid={heading ? undefined : 'globalVillageAboutSection'}
      >
        <div
          data-reveal-stagger='up'
          className='grid gap-6 md:grid-cols-2 lg:auto-cols-fr lg:grid-flow-col lg:grid-cols-none lg:gap-8'
        >
          {sections.map((section, index) => {
            const imageData = section.sectionImage
              ? getImagePayloadUrl(section.sectionImage)
              : null;
            const key = section.id ?? `section-${index}`;

            return (
              <article className='card flex flex-col overflow-hidden' key={key}>
                {imageData?.url && (
                  <ImageMedia
                    src={imageData.url}
                    alt={imageData.alt || ''}
                    width={imageData.width ?? 800}
                    height={imageData.height ?? 400}
                    sizes='(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw'
                    className='aspect-video w-full object-cover'
                  />
                )}

                <div className='flex flex-1 flex-col gap-3 p-6'>
                  {section.title && <h3 className='text-h3_semibold'>{section.title}</h3>}

                  {section.content && (
                    <RichText data={section.content} className='text-body_regular' lng={lng} />
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {cta?.enable && cta.link?.label && (
          <div className='mt-10 flex justify-center lg:mt-12'>
            <CMSLink lng={lng} {...cta.link} appearance='default' size='lg' />
          </div>
        )}
      </HawkStarsSection>
    </>
  );
};
