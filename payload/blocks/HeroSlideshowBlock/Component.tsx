'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LuChevronLeft, LuChevronRight, LuPause, LuPlay } from 'react-icons/lu';
import { useTranslation } from '@/i18n/client';
import type { HeroSlideshowBlock as HeroSlideshowBlockProps } from '@/payload-types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getImagePayloadUrl } from '@/lib/image';
import { ImageMedia } from '@/payload/components/Media';
import { getLinkFieldInformation } from '@/utils/page';
import { HawkStarsSection } from '@/components/layout';
import { Language } from '@/i18n/settings';
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';

const heightClasses = {
  fullscreen: 'min-h-svh',
  large: 'min-h-150 lg:min-h-175',
  medium: 'min-h-125',
  small: 'min-h-100',
} as const;

const alignmentClasses = {
  left: 'text-left items-start',
  center: 'text-center items-center',
  right: 'text-right items-end',
} as const;

const ctaRowAlignment = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
} as const;

// Round glass controls over the photo; size-11 keeps every one a 44px tap target.
const controlClasses =
  'flex size-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors outline-none hover:bg-white/40 focus-visible:ring-2 focus-visible:ring-white';

const SWIPE_THRESHOLD_PX = 40;

const HeroSlideshowBlock: React.FC<HeroSlideshowBlockProps & { lng: Language }> = (data) => {
  const HeadingTag = data.headingLevel === 'h2' ? 'h2' : 'h1';

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  // WCAG 2.2.2 (Level A): anything that moves automatically for more than five
  // seconds needs a mechanism to pause it. Autoplay defaults to on, so this shipped
  // on by default with only prev/next and dots.
  const [isPaused, setIsPaused] = useState(false);

  const {
    slides = [],
    overlayOpacity = 40,
    autoplay = true,
    autoplayInterval = 5000,
    showNavigation = true,
    showDots = true,
    height = 'large',
    sectionId,
    lng,
  } = data || {};

  const { t } = useTranslation(lng, 'common');

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

  // Arrows are hidden on phones (they covered the subtitle), so swiping is the
  // primary way to change slides there.
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current;
    const end = e.changedTouches[0]?.clientX;
    touchStartX.current = null;
    if (start === null || end === undefined || (slides?.length ?? 0) <= 1) return;
    const delta = end - start;
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
    if (delta < 0) nextSlide();
    else prevSlide();
  };

  // Respect the OS-level reduced-motion preference: no automatic movement at all.
  // Subscribed via useSyncExternalStore rather than an effect, so there is no
  // setState-during-effect and the server render has a defined snapshot.
  const prefersReducedMotion = usePrefersReducedMotion();

  const autoplayActive = Boolean(autoplay) && !isPaused && !prefersReducedMotion;

  useEffect(() => {
    if (!autoplayActive || !slides || slides.length <= 1) return;

    const interval = setInterval(nextSlide, autoplayInterval || 1000);
    return () => clearInterval(interval);
  }, [autoplayActive, autoplayInterval, nextSlide, slides]);

  if (!data || !slides || slides.length === 0) return null;

  return (
    <HawkStarsSection
      spacing='none'
      padding='none'
      cap='none'
      className={cn(
        'relative w-full overflow-hidden',
        heightClasses[height as keyof typeof heightClasses]
      )}
      id={sectionId || undefined}
      data-blockid='heroSlideshowBlock'
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      {slides.map((slide, index: number) => {
        const bgImage = getImagePayloadUrl(slide.backgroundImage);
        if (!bgImage) return null;

        return (
          <div
            key={slide.id || index}
            // `opacity-0` alone left every off-screen slide in the DOM, the
            // accessibility tree and the tab order — screen readers read all slides as
            // one block and Tab walked through invisible CTAs.
            aria-hidden={index !== currentSlide}
            inert={index !== currentSlide}
            className={cn(
              'absolute inset-0 transition-opacity duration-500',
              index === currentSlide ? 'z-10 opacity-100' : 'z-0 opacity-0'
            )}
          >
            {/* Background Image */}
            {bgImage?.url && (
              <ImageMedia
                src={bgImage.url}
                // The slide title is already read as the heading; without an editor
                // alt the photo is decorative.
                alt={bgImage.alt || ''}
                fill
                className='animate-ken-burns object-cover'
                preload={index <= 1 ? true : false}
                data-blockid={`heroSlideshowBlock-backgroundImage-${index}`}
                sizes='100vw'
              />
            )}

            {/* Overlay */}
            <div
              className='absolute inset-0 bg-black'
              style={{ opacity: (overlayOpacity ?? 40) / 100 }}
            />
            {/* Fixed scrim under the text, so white type stays legible on bright
                photos whatever the editor sets the overlay to. */}
            <div
              aria-hidden='true'
              className='absolute inset-0 bg-linear-to-t from-black/60 via-black/25 to-black/10'
            />
            {/* Brand tint, the same green-to-ink wash as the landing page hero. */}
            <div
              aria-hidden='true'
              className='from-green-dark/40 to-ink/40 absolute inset-0 bg-linear-to-br via-transparent'
            />

            {/* Content */}
            <div
              className={cn(
                'section-container relative z-10 flex h-full flex-col justify-center py-16 pb-24 lg:py-20',
                heightClasses[height as keyof typeof heightClasses],
                alignmentClasses[slide.textAlignment as keyof typeof alignmentClasses]
              )}
            >
              {/* The rise animation is only applied to the active slide, so it replays
                  each time a slide comes in. */}
              <div
                className={cn(
                  'flex max-w-4xl flex-col gap-5 lg:gap-6',
                  index === currentSlide &&
                    '*:animate-rise [&>*:nth-child(2)]:[animation-delay:200ms] [&>*:nth-child(3)]:[animation-delay:400ms]'
                )}
              >
                {slide.title &&
                  (() => {
                    // One <h1> per page: the tag was computed once and rendered inside
                    // the slide map, so a four-slide hero emitted four <h1>s.
                    const SlideHeading = index === 0 ? HeadingTag : 'h2';
                    return (
                      <SlideHeading className='text-display text-white'>{slide.title}</SlideHeading>
                    );
                  })()}

                {slide.subtitle && (
                  <p className='text-h2_light max-w-2xl text-white/90'>{slide.subtitle}</p>
                )}

                {slide.links && slide.links.length > 0 && (
                  <div
                    className={cn(
                      'mt-2 flex flex-wrap gap-3 lg:mt-4 lg:gap-4',
                      ctaRowAlignment[slide.textAlignment as keyof typeof ctaRowAlignment]
                    )}
                  >
                    {slide.links.map((link, linkIndex) => {
                      const linkInfo = getLinkFieldInformation(link.link, lng);
                      if (!linkInfo) return null;
                      const { url, label, newTab } = linkInfo;
                      return (
                        <Button
                          key={link.id ?? linkIndex}
                          size='xl'
                          variant={linkIndex === 0 ? 'inverse' : 'outline-inverse'}
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
                      );
                    })}
                  </div>
                )}
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
            type='button'
            className={cn(
              controlClasses,
              'absolute top-1/2 left-4 z-20 hidden size-12 -translate-y-1/2 lg:flex'
            )}
            aria-label={t('a11y.prevSlide')}
          >
            <LuChevronLeft className='size-6' aria-hidden='true' />
          </button>
          <button
            onClick={nextSlide}
            type='button'
            className={cn(
              controlClasses,
              'absolute top-1/2 right-4 z-20 hidden size-12 -translate-y-1/2 lg:flex'
            )}
            aria-label={t('a11y.nextSlide')}
          >
            <LuChevronRight className='size-6' aria-hidden='true' />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {showDots && slides.length > 1 && (
        <div className='absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2'>
          {slides.map((_, index) => (
            // The visible dot stays small; the button around it is a 44px tap target.
            <button
              key={index}
              type='button'
              onClick={() => goToSlide(index)}
              className='group flex h-11 min-w-7 items-center justify-center rounded-full px-1 outline-none focus-visible:ring-2 focus-visible:ring-white'
              aria-label={t('a11y.goToSlide', { number: index + 1 })}
              aria-current={index === currentSlide}
            >
              <span
                aria-hidden='true'
                className={cn(
                  'block h-3 rounded-full transition-all',
                  index === currentSlide
                    ? 'w-8 bg-white'
                    : 'w-3 bg-white/50 group-hover:bg-white/80'
                )}
              />
            </button>
          ))}
        </div>
      )}

      {/* Pause/play — required by WCAG 2.2.2 whenever autoplay is on. */}
      {autoplay && !prefersReducedMotion && slides.length > 1 && (
        <button
          type='button'
          onClick={() => setIsPaused((paused) => !paused)}
          className={cn(controlClasses, 'absolute right-4 bottom-4 z-20')}
          aria-label={isPaused ? t('a11y.playSlideshow') : t('a11y.pauseSlideshow')}
        >
          {isPaused ? (
            <LuPlay className='size-4' aria-hidden='true' />
          ) : (
            <LuPause className='size-4' aria-hidden='true' />
          )}
        </button>
      )}
    </HawkStarsSection>
  );
};

export { HeroSlideshowBlock };
