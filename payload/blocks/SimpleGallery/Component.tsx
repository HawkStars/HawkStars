'use client';

import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export interface SimpleGalleryBlockProps {
  title?: string;
  description?: string;
  images: Array<{
    image: string | { url: string };
    alt?: string;
  }>;
}

const SimpleGallery: React.FC<SimpleGalleryBlockProps> = ({
  title = 'Beautiful Interiors.',
  description = 'Explore our curated collection of stunning interior designs.\nEach space tells a unique story through thoughtful design and attention to detail.',
  images,
}) => {
  return (
    <section className='py-32'>
      <div className='container mx-auto'>
        <h2 className='mb-4 text-center text-4xl font-semibold'>{title}</h2>
        <p className='text-muted-foreground text-center text-sm'>
          {description.split('\n').map((line, idx) => (
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
              {images.map((img, index) => (
                <CarouselItem key={index} className='min-h-dvh basis-1/2'>
                  <img
                    src={typeof img.image === 'string' ? img.image : img.image.url}
                    alt={img.alt || 'placeholder'}
                    loading='lazy'
                    className='aspect-[3.8/5] w-full rounded-xl object-cover'
                  />
                </CarouselItem>
              ))}
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
