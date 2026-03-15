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
  autoplay = true,
  gridColumns = '2',
  sectionId,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [autoplayState, setAutoplayState] = useState<boolean>(autoplay ?? true);
  const progressRef = useRef<number>(0);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const [thumbnailMaxH, setThumbnailMaxH] = useState<number | undefined>(undefined);

  const imageCount = images?.length ?? 0;

  const nextIndex = useCallback((current: number) => (current + 1) % imageCount, [imageCount]);

  // Track main image height for thumbnail container constraint
  useEffect(() => {
    const el = mainImageRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setThumbnailMaxH(entry.contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-transition timer
  useEffect(() => {
    if (!autoplayState || imageCount <= 1) return;

    progressRef.current = 0;

    const interval = setInterval(() => {
      progressRef.current += TICK_INTERVAL;
      const progress = Math.min(progressRef.current / (transitionDuration ?? 5000), 1);

      if (progress >= 1) {
        progressRef.current = 0;
        setActiveIndex((prev) => nextIndex(prev));
      }
    }, TICK_INTERVAL);

    return () => clearInterval(interval);
  }, [autoplayState, activeIndex, imageCount, transitionDuration, nextIndex]);

  const handleImageClick = (index: number) => {
    setAutoplayState(false);
    setActiveIndex(index);
  };

  if (!images || images.length === 0) return null;

  const activeImage = getImagePayloadUrl(images[activeIndex]?.image);

  // The next image in queue (the one transitioning from grayscale to color)
  const upcomingIndex = nextIndex(activeIndex);

  return (
    <section className='py-16 lg:py-24' id={sectionId || ''}>
      <div className='container mx-auto px-4'>
        <div className='grid gap-2 lg:grid-cols-[3fr_1fr] lg:gap-4'>
          {/* Main showcased image */}
          <div ref={mainImageRef} className='relative max-h-120 min-h-180 w-full rounded-xl'>
            {activeImage && (
              <Image
                src={activeImage.url}
                alt={activeImage.alt || ''}
                fill
                className='rounded-2xl object-contain'
                priority
              />
            )}
          </div>

          {/* Thumbnail grid */}
          <div
            className={cn(
              'flex gap-2 max-lg:flex-nowrap max-lg:overflow-x-auto lg:grid lg:auto-rows-min lg:gap-3 lg:overflow-y-auto',
              {
                'lg:grid-cols-1': gridColumns === '1',
                'lg:grid-cols-2': gridColumns === '2',
              }
            )}
            style={thumbnailMaxH ? { maxHeight: thumbnailMaxH } : undefined}
          >
            {images.map((img, index) => {
              const image = getImagePayloadUrl(img.image);
              if (!image) return null;

              const isActive = index === activeIndex;
              const isUpcoming = autoplay && index === upcomingIndex;

              const hasTransition = isActive || isUpcoming;

              return (
                <button
                  key={img.id || index}
                  type='button'
                  onClick={() => handleImageClick(index)}
                  className={cn(
                    'relative aspect-square w-full min-w-15 overflow-hidden rounded-lg'
                  )}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || ''}
                    fill
                    className={cn('object-cover', {
                      'animate-grayscale': hasTransition,
                      'grayscale-100': !hasTransition,
                    })}
                    style={{
                      animationDirection: isActive ? 'normal' : isUpcoming ? 'reverse' : '',
                      animationDuration: `${transitionDuration}ms`,
                    }}
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
