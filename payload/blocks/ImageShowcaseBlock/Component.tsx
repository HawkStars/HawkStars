'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import type { ImageShowcaseBlock as ImageShowcaseBlockProps } from '@/payload-types';
import { getImagePayloadUrl } from '@/lib/image';
import { cn } from '@/lib/utils';

const TICK_INTERVAL = 50;

export const ImageShowcaseBlock: React.FC<ImageShowcaseBlockProps> = ({
  images,
  transitionDuration = 5000,
  sectionId,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [grayscale, setGrayscale] = useState<number>(100);
  const [autoplay, setAutoplay] = useState<boolean>(true);
  const progressRef = useRef<number>(0);

  const imageCount = images?.length ?? 0;

  const nextIndex = useCallback((current: number) => (current + 1) % imageCount, [imageCount]);

  // Auto-transition timer
  useEffect(() => {
    if (!autoplay || imageCount <= 1) return;

    progressRef.current = 0;
    setGrayscale(100);

    const interval = setInterval(() => {
      progressRef.current += TICK_INTERVAL;
      const progress = Math.min(progressRef.current / (transitionDuration ?? 5000), 1);
      const currentGrayscale = Math.round(100 * (1 - progress));
      setGrayscale(currentGrayscale);

      if (progress >= 1) {
        progressRef.current = 0;
        setGrayscale(100);
        setActiveIndex((prev) => nextIndex(prev));
      }
    }, TICK_INTERVAL);

    return () => clearInterval(interval);
  }, [autoplay, activeIndex, imageCount, transitionDuration, nextIndex]);

  const handleImageClick = (index: number) => {
    setAutoplay(false);
    setGrayscale(0);
    setActiveIndex(index);
  };

  if (!images || images.length === 0) return null;

  const activeImage = getImagePayloadUrl(images[activeIndex]?.image);

  // The next image in queue (the one transitioning from grayscale to color)
  const upcomingIndex = nextIndex(activeIndex);

  return (
    <section className='py-16 lg:py-24' id={sectionId || ''}>
      <div className='container mx-auto px-4'>
        <div className='grid gap-6 lg:grid-cols-[2fr_1fr] lg:gap-8'>
          {/* Main showcased image */}
          <div className='relative aspect-4/3 w-full overflow-hidden rounded-xl'>
            {activeImage && (
              <Image
                src={activeImage.url}
                alt={activeImage.alt || ''}
                fill
                className='object-cover'
                priority
              />
            )}
          </div>

          {/* Thumbnail grid */}
          <div className='grid grid-cols-2 gap-3 lg:grid-cols-2 lg:gap-4'>
            {images.map((img, index) => {
              const image = getImagePayloadUrl(img.image);
              if (!image) return null;

              const isActive = index === activeIndex;
              const isUpcoming = autoplay && index === upcomingIndex;

              // Determine grayscale for this thumbnail
              let thumbGrayscale = 100;
              if (isActive) {
                thumbGrayscale = 0;
              } else if (isUpcoming) {
                thumbGrayscale = grayscale;
              }

              return (
                <button
                  key={img.id || index}
                  type='button'
                  onClick={() => handleImageClick(index)}
                  className={cn(
                    'relative aspect-square w-full overflow-hidden rounded-lg transition-shadow duration-300',
                    isActive && 'ring-primary ring-2 ring-offset-2'
                  )}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || ''}
                    fill
                    className='object-cover transition-[filter] duration-100'
                    style={{ filter: `grayscale(${thumbGrayscale}%)` }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
