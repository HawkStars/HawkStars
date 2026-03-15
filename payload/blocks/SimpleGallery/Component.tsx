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
import Image from 'next/image';

const SimpleGallery: React.FC<SimpleGalleryProps> = ({
  title = 'Beautiful Interiors.',
  description = 'Explore our curated collection of stunning interior designs.\nEach space tells a unique story through thoughtful design and attention to detail.',
  images,
  sectionId,
}) => {
  return (
    <section className='py-32' id={sectionId || ''}>
      <div className='container mx-auto'>
        <h2 className='mb-4 text-center text-4xl font-semibold'>{title}</h2>
        <p className='text-muted-foreground text-center text-sm'>
          {description?.split('\n').map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </p>
        <div className='mt-10'>
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className='mx-auto w-full max-w-6xl'
          >
            <CarouselContent
              style={{
                backfaceVisibility: 'hidden',
              }}
            >
              {images.map((img, index) => {
                const image = getImagePayloadUrl(img.image);
                if (!image) return null;
                return (
                  <CarouselItem key={index} className='relative min-h-dvh basis-1/2'>
                    <Image
                      src={image.url}
                      alt={image.alt || 'placeholder'}
                      loading='lazy'
                      fill
                      className='aspect-[3.8/5] w-full rounded-xl object-cover'
                    />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className='left-5 scale-120 border-none bg-black/30 text-white hover:bg-black/50 hover:text-white dark:bg-black/30 dark:hover:bg-black/50' />
            <CarouselNext className='right-5 scale-120 border-none bg-black/30 text-white hover:bg-black/50 hover:text-white dark:bg-black/30 dark:hover:bg-black/50' />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default SimpleGallery;
