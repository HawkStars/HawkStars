'use client';

import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { SimpleGallery as SimpleGalleryProps } from '@/payload-types';
import { getImagePayloadUrl } from '@/lib/image';
import { ImageMedia } from '@/payload/components/Media';
import { HawkStarsSection } from '@/components/layout';

// No defaults for `title`/`description`: they used to fall back to English
// interior-design placeholder copy ("Beautiful Interiors.", "Explore our curated
// collection of stunning interior designs."), which shipped verbatim whenever an
// editor left the fields empty. An empty field now renders nothing.
const SimpleGallery: React.FC<SimpleGalleryProps> = ({ title, description, images, sectionId }) => {
  return (
    <HawkStarsSection
      spacing='loose'
      padding='none'
      cap='none'
      container
      id={sectionId || undefined}
      data-blockid='simpleGallery'
    >
      {(title || description) && (
        <div className='section-header text-center'>
          {title && (
            <h2 data-reveal='up' className='text-h2_semibold'>
              {title}
            </h2>
          )}
          {description && (
            <p data-reveal='up' className='text-h2_light mt-4 whitespace-pre-line text-black/70'>
              {description}
            </p>
          )}
        </div>
      )}
      {/* Each slide used to be `min-h-dvh` — a full screen tall regardless of the photo —
          so on a phone one image filled the viewport and the arrows sat off-screen. Slides
          now share one portrait ratio; a peek of the next slide on mobile hints at swiping. */}
      <Carousel opts={{ align: 'start', loop: true }} className='w-full'>
        <CarouselContent style={{ backfaceVisibility: 'hidden' }}>
          {images.map((img, index) => {
            const image = getImagePayloadUrl(img.image);
            if (!image) return null;
            return (
              <CarouselItem key={img.id || index} className='basis-4/5 sm:basis-1/2 lg:basis-1/3'>
                <div className='bg-bege-dark relative aspect-4/5 overflow-hidden rounded-xl'>
                  <ImageMedia
                    src={image.url}
                    alt={image.alt || ''}
                    loading='lazy'
                    fill
                    className='object-cover'
                    sizes='(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 33vw'
                  />
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious
          variant='inverse'
          className='left-3 size-11 shadow-md disabled:opacity-0 lg:left-4'
        />
        <CarouselNext
          variant='inverse'
          className='right-3 size-11 shadow-md disabled:opacity-0 lg:right-4'
        />
      </Carousel>
    </HawkStarsSection>
  );
};

export default SimpleGallery;
