'use client';

import { ContentSection } from '@/components/layout';
import { ImageMedia } from '@/payload/components/Media';
import { MultiImageType } from '@/payload-types';
import { FC } from 'react';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { getImagePayloadUrl } from '@/lib/image';
import SectionHeader from '@/components/ui/SectionHeader';

type NewsSingleGalleryProps = { gallery: MultiImageType | undefined };

const NewsSingleGallery: FC<NewsSingleGalleryProps> = ({ gallery }) => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'common');
  const galleryImages = [...(gallery?.internalImages || []), ...(gallery?.externalImages || [])];

  if (galleryImages.length === 0) return null;

  return (
    <>
      <ContentSection>
        <div>
          <SectionHeader title={t('sections.gallery')} className='mb-8' />
          <div className='grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-4'>
            {galleryImages.map((image, i) => {
              const galleryImage = getImagePayloadUrl(image);

              if (!galleryImage) return null;

              return (
                <div
                  key={`image-${i}`}
                  className='group bg-bege-dark relative aspect-4/3 overflow-hidden rounded-xl shadow-sm'
                >
                  <ImageMedia
                    src={galleryImage.url}
                    alt={galleryImage.alt || ''}
                    fill
                    className='object-cover transition-transform duration-700 group-hover:scale-105'
                    sizes='(max-width: 768px) 50vw, 33vw'
                    quality={80}
                  />
                  <div className='absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10' />
                </div>
              );
            })}
          </div>
        </div>
      </ContentSection>
    </>
  );
};

export default NewsSingleGallery;
