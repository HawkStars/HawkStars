'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { ImageShowcaseBlock as ImageShowcaseBlockProps } from '@/payload-types';
import { getImagePayloadUrl } from '@/lib/image';
import { ImageMedia } from '@/payload/components/Media';
import { cn } from '@/lib/utils';
import { HawkStarsSection } from '@/components/layout';
import { useTranslation } from '@/i18n/client';
import { Language } from '@/i18n/settings';
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';
import { LuPause, LuPlay } from 'react-icons/lu';
import { Button } from '@/components/ui/button';

const TICK_INTERVAL = 50;

export const ImageShowcaseBlock = ({
  images,
  transitionDuration,
  autoplay = true,
  gridColumns = '2',
  sectionId,
  lng,
}: ImageShowcaseBlockProps & { lng: Language }) => {
  const { t } = useTranslation(lng, 'common');
  // `transitionDuration` is `number | null`; the `= 5000` default parameter only
  // catches undefined, so a null produced the invalid inline style `"nullms"`.
  const duration = transitionDuration ?? 5000;
  const prefersReducedMotion = usePrefersReducedMotion();

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
      setThumbnailMaxH(entry?.contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-transition timer
  const autoplayActive = autoplayState && !prefersReducedMotion;

  useEffect(() => {
    if (!autoplayActive || imageCount <= 1) return;

    progressRef.current = 0;

    const interval = setInterval(() => {
      progressRef.current += TICK_INTERVAL;
      const progress = Math.min(progressRef.current / duration, 1);

      if (progress >= 1) {
        progressRef.current = 0;
        setActiveIndex((prev) => nextIndex(prev));
      }
    }, TICK_INTERVAL);

    return () => clearInterval(interval);
  }, [autoplayActive, activeIndex, imageCount, duration, nextIndex]);

  const handleImageClick = (index: number) => {
    setAutoplayState(false);
    setActiveIndex(index);
  };

  if (!images || images.length === 0) return null;

  const activeImage = getImagePayloadUrl(images[activeIndex]?.image);

  // The next image in queue (the one transitioning from grayscale to color)
  const upcomingIndex = nextIndex(activeIndex);

  return (
    <HawkStarsSection
      spacing='default'
      padding='none'
      cap='none'
      container
      id={sectionId || undefined}
      data-blockid='imageShowcase'
    >
      {autoplay && !prefersReducedMotion && imageCount > 1 && (
        <div className='mb-2 flex justify-end'>
          <Button
            type='button'
            variant='secondary'
            size='icon'
            onClick={() => setAutoplayState((paused) => !paused)}
            className='size-11 rounded-full'
            aria-label={autoplayState ? t('a11y.pauseSlideshow') : t('a11y.playSlideshow')}
          >
            {autoplayState ? <LuPause /> : <LuPlay />}
          </Button>
        </div>
      )}

      <div className='grid gap-2 lg:grid-cols-[3fr_1fr] lg:gap-4'>
        {/* Main showcased image */}
        {/* `min-h` beats a smaller `max-h` in CSS, so max-h-120 never applied and the
            stage was unconditionally ≥720px — far below the fold on phones. */}
        <div
          ref={mainImageRef}
          className='bg-bege-light relative max-h-180 min-h-80 w-full overflow-hidden rounded-xl'
        >
          {activeImage && (
            <>
              <ImageMedia
                src={activeImage.url}
                alt={activeImage.alt || ''}
                fill
                className='object-cover max-lg:object-contain'
                preload
                sizes='(max-width: 1024px) 100vw, 75vw'
              />
              {activeImage.alt && (
                <span className='card-sm text-body_regular absolute right-3 bottom-3 max-w-[calc(100%-1.5rem)] px-3 py-1.5'>
                  {activeImage.alt}
                </span>
              )}
            </>
          )}
        </div>

        {/* Thumbnail grid */}
        <div
          className={cn(
            'flex gap-2 max-lg:flex-nowrap max-lg:overflow-x-auto max-lg:py-1 lg:grid lg:auto-rows-min lg:gap-3 lg:overflow-y-auto lg:p-1',
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
            // Was `autoplay` (the prop), so pausing stopped the timer but left this
            // thumbnail animating against a carousel that was no longer moving.
            const isUpcoming = autoplayActive && index === upcomingIndex;

            const hasTransition = isActive || isUpcoming;

            return (
              <button
                key={img.id || index}
                type='button'
                onClick={() => handleImageClick(index)}
                aria-label={t('a11y.goToSlide', { number: index + 1 })}
                aria-current={isActive}
                className={cn(
                  'bg-bege-dark focus-visible:ring-green relative aspect-square w-20 shrink-0 overflow-hidden rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden lg:w-full',
                  {
                    'animate-grayscale': hasTransition,
                    'grayscale-100': !hasTransition,
                  }
                )}
                style={{
                  animationDirection: isActive ? 'normal' : isUpcoming ? 'reverse' : '',
                  animationDuration: `${duration}ms`,
                }}
              >
                <ImageMedia
                  src={image.url}
                  alt={image.alt || ''}
                  fill
                  className='object-cover'
                  sizes='(max-width: 1024px) 80px, 12vw'
                />
              </button>
            );
          })}
        </div>
      </div>
    </HawkStarsSection>
  );
};
