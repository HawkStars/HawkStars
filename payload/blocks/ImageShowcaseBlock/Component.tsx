'use client';

import { useSyncExternalStore, useState, useEffect, useCallback, useRef } from 'react';
import type { ImageShowcaseBlock as ImageShowcaseBlockProps } from '@/payload-types';
import { getImagePayloadUrl } from '@/lib/image';
import { ImageMedia } from '@/payload/components/Media';
import { cn } from '@/lib/utils';
import { HawkStarsSection } from '@/components/layout';
import { useTranslation } from '@/i18n/client';
import { Language } from '@/i18n/settings';
import { LuPause, LuPlay } from 'react-icons/lu';

const TICK_INTERVAL = 50;

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const subscribeReducedMotion = (onStoreChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener('change', onStoreChange);
  return () => query.removeEventListener('change', onStoreChange);
};

const getReducedMotionSnapshot = () => window.matchMedia(REDUCED_MOTION_QUERY).matches;
const getReducedMotionServerSnapshot = () => false;

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
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

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
          <button
            type='button'
            onClick={() => setAutoplayState((paused) => !paused)}
            className='focus-visible:ring-ring rounded-full bg-black/10 p-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden'
            aria-label={autoplayState ? t('a11y.pauseSlideshow') : t('a11y.playSlideshow')}
          >
            {autoplayState ? <LuPause className='h-4 w-4' /> : <LuPlay className='h-4 w-4' />}
          </button>
        </div>
      )}

      <div className='grid gap-2 lg:grid-cols-[3fr_1fr] lg:gap-4'>
        {/* Main showcased image */}
        {/* `min-h` beats a smaller `max-h` in CSS, so max-h-120 never applied and the
            stage was unconditionally ≥720px — far below the fold on phones. */}
        <div ref={mainImageRef} className='relative max-h-[45rem] min-h-[20rem] w-full rounded-xl'>
          {activeImage && (
            <>
              <ImageMedia
                src={activeImage.url}
                alt={activeImage.alt || ''}
                fill
                className='rounded-2xl max-lg:object-contain'
                preload
                sizes='(max-width: 1024px) 100vw, 75vw'
              />
              <span className='absolute right-2 bottom-2 rounded-2xl bg-white p-2'>
                {activeImage.alt}
              </span>
            </>
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
                className={cn('relative aspect-square w-full min-w-15 overflow-hidden rounded-lg', {
                  'animate-grayscale': hasTransition,
                  'grayscale-100': !hasTransition,
                })}
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
                  sizes='100vw'
                />
              </button>
            );
          })}
        </div>
      </div>
    </HawkStarsSection>
  );
};
