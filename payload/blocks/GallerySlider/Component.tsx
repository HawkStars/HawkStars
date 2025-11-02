'use client';

import React, { useState, useEffect } from 'react';
import type { GallerySliderBlock as GallerySliderProps } from '@/payload-types';
import { Media } from '../../components/Media';
import { cn } from '@/payload/utilities/ui';

export const GallerySliderBlock: React.FC<GallerySliderProps> = ({
  images,
  autoplay,
  autoplayDelay,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoplay || !images || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, autoplayDelay || 3000);

    return () => clearInterval(interval);
  }, [autoplay, autoplayDelay, images]);

  if (!images || images.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className='container'>
      <div className='relative overflow-hidden rounded-lg'>
        {/* Main Image Display */}
        <div className='relative aspect-video w-full'>
          {images.map((item, index) => (
            <div
              key={index}
              className={cn(
                'absolute inset-0 transition-opacity duration-500',
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              )}
            >
              {item.image && typeof item.image === 'object' && (
                <Media resource={item.image} imgClassName='h-full w-full object-cover rounded-lg' />
              )}
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className='absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg transition-all hover:bg-white'
              aria-label='Previous image'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={2}
                stroke='currentColor'
                className='h-6 w-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M15.75 19.5L8.25 12l7.5-7.5'
                />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className='absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg transition-all hover:bg-white'
              aria-label='Next image'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={2}
                stroke='currentColor'
                className='h-6 w-6'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
              </svg>
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {images.length > 1 && (
          <div className='absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2'>
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'h-2 w-2 rounded-full transition-all',
                  index === currentIndex ? 'w-8 bg-white' : 'bg-white/50'
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
