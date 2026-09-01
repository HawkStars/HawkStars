'use client';

import { HawkStarsSection } from '@/components/layout';
import { ImageMedia } from '@/payload/components/Media';
import { MultiImageType } from '@/payload-types';
import { FC } from 'react';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { getImagePayloadUrl } from '@/lib/image';

type NewsSingleGalleryProps = { gallery: MultiImageType | undefined };

const NewsSingleGallery: FC<NewsSingleGalleryProps> = ({ gallery }) => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'common');
  const galleryImages = [...(gallery?.internalImages || []), ...(gallery?.externalImages || [])];

  if (galleryImages.length === 0) return null;

  return (
    <>
      <HawkStarsSection className='py-12 lg:py-16'>
        <div className='mx-auto max-w-5xl'>
          <div className='mb-8 flex items-center gap-3'>
            <div className='bg-green h-1 w-8 rounded-full' />
            <h2 className='text-h2_light text-green'>{t('sections.gallery')}</h2>
          </div>
          <div className='grid grid-cols-2 gap-3 md:grid-cols-3'>
            {galleryImages.map((image, i) => {
              const galleryImage = getImagePayloadUrl(image);

              if (!galleryImage) return null;

              return (
                <div key={`image-${i}`} className='group relative overflow-hidden rounded-lg'>
                  <ImageMedia
                    src={galleryImage.url}
                    alt={galleryImage.alt || ''}
                    width={galleryImage.width || 600}
                    height={galleryImage.width || 400}
                    className='aspect-auto h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                    sizes='(max-width: 768px) 100vw, 33vw'
                    quality={80}
                  />
                  <div className='absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10' />
                </div>
              );
            })}
          </div>
        </div>
      </HawkStarsSection>
    </>
  );
};

export default NewsSingleGallery;
