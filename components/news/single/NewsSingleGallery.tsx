import { HawkStarsSection } from '@/components/layout';
import HawkImage from '@/components/ui/hawk-image';
import { Media, MultiImageType } from '@/payload-types';
import { FC } from 'react';

type NewsSingleGalleryProps = { gallery: MultiImageType | undefined };

const NewsSingleGallery: FC<NewsSingleGalleryProps> = ({ gallery }) => {
  const galleryImages = [...(gallery?.internalImages || []), ...(gallery?.externalImages || [])];

  if (galleryImages.length === 0) return null;

  return (
    <>
      <HawkStarsSection className='py-12 lg:py-16'>
        <div className='mx-auto max-w-5xl'>
          <div className='mb-8 flex items-center gap-3'>
            <div className='bg-green h-1 w-8 rounded-full' />
            <h2 className='text-h2_light text-green'>Galeria</h2>
          </div>
          <div className='grid grid-cols-2 gap-3 md:grid-cols-3'>
            {galleryImages.map((image, i) => {
              if (!image) return null;
              let url: string | undefined;
              let alt: string | undefined;
              let width: number | undefined;
              let height: number | undefined;

              if ('media' in image && image.media) {
                const mediaImage = image.media as Media;
                url = mediaImage.url || undefined;
                alt = mediaImage.alt;
                width = mediaImage.width || 600;
                height = mediaImage.height || 400;
              } else if ('url' in image && image.url) {
                url = image.url;
                alt = image.alt;
              }

              if (!url) return null;

              return (
                <div key={`image-${i}`} className='group relative overflow-hidden rounded-lg'>
                  <HawkImage
                    src={url}
                    alt={alt || ''}
                    width={width || 600}
                    height={height || 400}
                    className='aspect-auto h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                    sizes='(max-width: 768px) 100vw, 33vw'
                    quality={85}
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
