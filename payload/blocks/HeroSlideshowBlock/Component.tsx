'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { HeroSlideshowBlock as HeroSlideshowBlockProps } from '@/payload-types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getImagePayloadUrl } from '@/lib/image';
import { getLinkFieldInformation } from '@/utils/page';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';

const heightClasses = {
  fullscreen: 'min-h-screen',
  large: 'min-h-[700px]',
  medium: 'min-h-[500px]',
  small: 'min-h-[400px]',
} as const;

const alignmentClasses = {
  left: 'text-left items-start',
  center: 'text-center items-center',
  right: 'text-right items-end',
} as const;

const HeroSlideshowBlock: React.FC<HeroSlideshowBlockProps> = (data) => {
  const lng = useLanguageCookie();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const {
    slides = [],
    overlayOpacity = 40,
    autoplay = true,
    autoplayInterval = 5000,
    showNavigation = true,
    showDots = true,
    height = 'large',
    sectionId,
  } = data || {};

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentSlide(index);
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [isTransitioning]
  );

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % (slides?.length || 1));
  }, [currentSlide, slides?.length, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + (slides?.length || 1)) % (slides?.length || 1));
  }, [currentSlide, slides?.length, goToSlide]);

  useEffect(() => {
    if (!autoplay || !slides || slides.length <= 1) return;

    const interval = setInterval(nextSlide, autoplayInterval || 1000);
    return () => clearInterval(interval);
  }, [autoplay, autoplayInterval, nextSlide, slides]);

  if (!data || !slides || slides.length === 0) return null;

  return (
    <section
      className={cn(
        'relative w-full overflow-hidden',
        heightClasses[height as keyof typeof heightClasses]
      )}
      id={sectionId || ''}
    >
      {/* Slides */}
      {slides.map((slide, index: number) => {
        const bgImage = getImagePayloadUrl(slide.backgroundImage);
        if (!bgImage) return null;

        return (
          <div
            key={slide.id || index}
            className={cn(
              'absolute inset-0 transition-opacity duration-500',
              index === currentSlide ? 'z-10 opacity-100' : 'z-0 opacity-0'
            )}
          >
            {/* Background Image */}
            {bgImage?.url && (
              <Image
                src={bgImage.url}
                alt={bgImage.alt || slide.title || `Slide ${index + 1}`}
                fill
                className='object-cover'
                priority={index === 0}
              />
            )}

            {/* Overlay */}
            <div
              className='absolute inset-0 bg-black'
              style={{ opacity: (overlayOpacity ?? 40) / 100 }}
            />

            {/* Content */}
            <div
              className={cn(
                'relative z-10 container mx-auto flex h-full flex-col justify-center px-4 py-16',
                heightClasses[height as keyof typeof heightClasses],
                alignmentClasses[slide.textAlignment as keyof typeof alignmentClasses]
              )}
            >
              <div className={cn('flex max-w-4xl flex-col gap-6')}>
                {slide.title && (
                  <h1 className='text-4xl font-bold text-white lg:text-6xl xl:text-7xl'>
                    {slide.title}
                  </h1>
                )}

                {slide.subtitle && (
                  <p className='max-w-2xl text-lg text-white/90 lg:text-xl'>{slide.subtitle}</p>
                )}

                {slide.links?.map((link, index) => {
                  const linkInfo = getLinkFieldInformation(link.link, lng);
                  if (!linkInfo) return null;
                  const { url, label, newTab } = linkInfo;
                  return (
                    <div className='mt-4' key={index}>
                      <Button
                        size='lg'
                        className='bg-white text-gray-900 hover:bg-gray-100'
                        asChild
                      >
                        <a
                          href={url}
                          target={newTab ? '_blank' : '_self'}
                          rel={newTab ? 'noopener noreferrer' : undefined}
                        >
                          {label}
                        </a>
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      {showNavigation && slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className='absolute top-1/2 left-4 z-20 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/40'
            aria-label='Previous slide'
          >
            <ChevronLeft className='h-6 w-6' />
          </button>
          <button
            onClick={nextSlide}
            className='absolute top-1/2 right-4 z-20 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/40'
            aria-label='Next slide'
          >
            <ChevronRight className='h-6 w-6' />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {showDots && slides.length > 1 && (
        <div className='absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2'>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'h-3 w-3 rounded-full transition-all',
                index === currentSlide ? 'w-8 bg-white' : 'bg-white/50 hover:bg-white/80'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export { HeroSlideshowBlock };
