'use client';

import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import type { ImageShowcaseBlock as ImageShowcaseBlockProps } from '@/payload-types';
import { getImagePayloadUrl } from '@/lib/image';
import { ImageMedia } from '@/payload/components/Media';
import { cn } from '@/lib/utils';
import { HawkStarsSection } from '@/components/layout';
import SectionHeader from '@/components/ui/SectionHeader';
import { useTranslation } from '@/i18n/client';
import { Language } from '@/i18n/settings';
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';
import { LuChevronLeft, LuChevronRight, LuPause, LuPlay } from 'react-icons/lu';
import { Button } from '@/components/ui/button';

/** Horizontal drag distance (px) that counts as a swipe on the stage. */
const SWIPE_THRESHOLD = 50;

const STAGE_SIZES = '(max-width: 1024px) 100vw, 1200px';

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * A single large stage that crossfades between images, with a filmstrip of
 * thumbnails underneath.
 *
 * - Images of any ratio fit the stage (`object-contain`) over a blurred copy of
 *   themselves, so nothing is cropped and there are no empty bars.
 * - Autoplay is driven by the progress bar's CSS animation: when it ends, the
 *   next image shows. Pausing just pauses the animation, so resuming continues
 *   from where it stopped instead of restarting the timer.
 * - Autoplay pauses on hover/focus (WCAG 2.2.2), stops for reduced motion, and
 *   stops for good once the visitor navigates themselves.
 * - Only the active image, its neighbours and the one fading out are mounted,
 *   so a 12-image showcase does not download 12 full-size images up front.
 */
export const ImageShowcaseBlock = ({
  title,
  description,
  images,
  transitionDuration,
  autoplay = true,
  sectionId,
  lng,
}: ImageShowcaseBlockProps & { lng: Language }) => {
  const { t } = useTranslation(lng, 'common');
  // `transitionDuration` is `number | null`; a default parameter only catches undefined.
  const duration = transitionDuration ?? 5000;
  const prefersReducedMotion = usePrefersReducedMotion();

  const [activeIndex, setActiveIndex] = useState(0);
  const [leavingIndex, setLeavingIndex] = useState<number | null>(null);
  const [playing, setPlaying] = useState(autoplay ?? true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const filmstripRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pointerStartX = useRef<number | null>(null);

  const count = images?.length ?? 0;
  const canAutoplay = Boolean(autoplay) && !prefersReducedMotion && count > 1;
  const autoplayRunning = canAutoplay && playing;
  const autoplayPaused = !autoplayRunning || hovered || focused;

  const goTo = (index: number) => {
    if (count === 0) return;
    const next = ((index % count) + count) % count;
    if (next === activeIndex) return;
    setLeavingIndex(activeIndex);
    setActiveIndex(next);
  };

  // Manual navigation hands control to the visitor.
  const navigate = (index: number) => {
    setPlaying(false);
    goTo(index);
  };

  // Keep the active thumbnail in view without scrolling the page itself.
  useEffect(() => {
    const strip = filmstripRef.current;
    const thumb = thumbRefs.current[activeIndex];
    if (!strip || !thumb) return;
    const left = thumb.offsetLeft - strip.clientWidth / 2 + thumb.clientWidth / 2;
    strip.scrollTo({ left, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }, [activeIndex, prefersReducedMotion]);

  if (!images || count === 0) return null;

  const resolved = images.map((img) => getImagePayloadUrl(img.image));
  const active = resolved[activeIndex];
  const activeCaption = images[activeIndex]?.caption;

  const mounted = new Set([
    activeIndex,
    (activeIndex + 1) % count,
    (activeIndex - 1 + count) % count,
  ]);
  if (leavingIndex !== null) mounted.add(leavingIndex);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = {
      ArrowLeft: activeIndex - 1,
      ArrowRight: activeIndex + 1,
      Home: 0,
      End: count - 1,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    navigate(keys[event.key]!);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    pointerStartX.current = event.clientX;
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current === null) return;
    const delta = event.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    navigate(delta < 0 ? activeIndex + 1 : activeIndex - 1);
  };

  const positionLabel = t('a11y.imageOf', { current: activeIndex + 1, total: count });

  return (
    <HawkStarsSection
      spacing='default'
      padding='none'
      cap='none'
      container
      id={sectionId || undefined}
      data-blockid='imageShowcase'
    >
      {(title || description) && (
        <SectionHeader
          reveal
          title={title}
          subtitle={description}
          subtitleClassName='whitespace-pre-line'
          className='mb-8 lg:mb-10'
        />
      )}

      <div
        role='region'
        aria-roledescription='carousel'
        aria-label={title || t('a11y.slideshow')}
        onKeyDown={handleKeyDown}
        // Touch taps fire enter but never leave, so only a real mouse pauses on hover.
        onPointerEnter={(event) => event.pointerType === 'mouse' && setHovered(true)}
        onPointerLeave={(event) => event.pointerType === 'mouse' && setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
        }}
      >
        {/* Stage */}
        <div
          className='group relative aspect-4/3 w-full touch-pan-y overflow-hidden rounded-2xl bg-neutral-950 select-none sm:aspect-16/10 lg:aspect-video'
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => (pointerStartX.current = null)}
        >
          {images.map((img, index) => {
            const image = resolved[index];
            if (!image?.url || !mounted.has(index)) return null;
            const isActive = index === activeIndex;

            return (
              <div
                key={img.id || index}
                role='group'
                aria-roledescription='slide'
                aria-label={t('a11y.imageOf', { current: index + 1, total: count })}
                aria-hidden={!isActive}
                className={cn(
                  'absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none',
                  isActive ? 'z-10 opacity-100' : 'z-0 opacity-0'
                )}
                onTransitionEnd={(event) => {
                  if (event.target !== event.currentTarget) return;
                  if (index === leavingIndex) setLeavingIndex(null);
                }}
              >
                {/* Blurred fill so any aspect ratio sits on its own colours */}
                <ImageMedia
                  src={image.url}
                  alt=''
                  fill
                  aria-hidden
                  className='scale-110 object-cover opacity-60 blur-2xl'
                  sizes={STAGE_SIZES}
                  preload={index === 0}
                />
                <ImageMedia
                  src={image.url}
                  alt={image.alt || ''}
                  fill
                  className={cn(
                    'object-contain transition-transform duration-[1200ms] ease-out motion-reduce:transition-none',
                    isActive ? 'scale-100' : 'scale-[1.04]'
                  )}
                  sizes={STAGE_SIZES}
                  preload={index === 0}
                  draggable={false}
                />
              </div>
            );
          })}

          {/* Caption + counter */}
          <div className='pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-4 bg-linear-to-t from-black/75 via-black/30 to-transparent px-4 pt-16 pb-5 text-white lg:px-6 lg:pb-6'>
            <p
              key={activeIndex}
              className='text-body_regular motion-safe:animate-rise max-w-2xl text-balance drop-shadow-sm'
            >
              {activeCaption}
            </p>
            <p className='shrink-0 font-mono text-sm tracking-widest tabular-nums' aria-hidden>
              <span className='font-semibold'>{pad(activeIndex + 1)}</span>
              <span className='text-white/60'> / {pad(count)}</span>
            </p>
          </div>

          {/* Autoplay timer — when the bar fills, the next image shows */}
          {canAutoplay && (
            <div className='absolute inset-x-0 bottom-0 z-30 h-1 bg-white/15' aria-hidden>
              {playing && (
                <div
                  key={activeIndex}
                  className='bg-green h-full origin-left'
                  style={{
                    animation: `showcase-progress ${duration}ms linear forwards`,
                    animationPlayState: autoplayPaused ? 'paused' : 'running',
                  }}
                  onAnimationEnd={() => goTo(activeIndex + 1)}
                />
              )}
            </div>
          )}

          {count > 1 && (
            <>
              <Button
                type='button'
                variant='inverse'
                size='icon'
                onClick={() => navigate(activeIndex - 1)}
                aria-label={t('a11y.prevImage')}
                className='absolute top-1/2 left-3 z-30 size-11 -translate-y-1/2 rounded-full shadow-md transition-opacity focus-visible:opacity-100 lg:left-5 lg:opacity-0 lg:group-hover:opacity-100'
              >
                <LuChevronLeft className='size-5' />
              </Button>
              <Button
                type='button'
                variant='inverse'
                size='icon'
                onClick={() => navigate(activeIndex + 1)}
                aria-label={t('a11y.nextImage')}
                className='absolute top-1/2 right-3 z-30 size-11 -translate-y-1/2 rounded-full shadow-md transition-opacity focus-visible:opacity-100 lg:right-5 lg:opacity-0 lg:group-hover:opacity-100'
              >
                <LuChevronRight className='size-5' />
              </Button>
            </>
          )}

          {canAutoplay && (
            <Button
              type='button'
              variant='outline-inverse'
              size='icon'
              onClick={() => setPlaying((value) => !value)}
              aria-label={playing ? t('a11y.pauseSlideshow') : t('a11y.playSlideshow')}
              className='absolute top-3 right-3 z-30 size-11 rounded-full bg-black/30 backdrop-blur-sm lg:top-5 lg:right-5'
            >
              {playing ? <LuPause /> : <LuPlay />}
            </Button>
          )}
        </div>

        {/* Announce changes only when the visitor drives them, not every autoplay tick */}
        <p className='sr-only' aria-live={autoplayRunning ? 'off' : 'polite'} aria-atomic>
          {positionLabel}
          {activeCaption ? `: ${activeCaption}` : active?.alt ? `: ${active.alt}` : ''}
        </p>

        {/* Filmstrip */}
        {count > 1 && (
          <div ref={filmstripRef} className='relative mt-3 overflow-x-auto scroll-smooth lg:mt-4'>
            <div className='mx-auto flex w-max gap-2 p-1 lg:gap-3'>
              {images.map((img, index) => {
                const image = resolved[index];
                if (!image?.url) return null;
                const isActive = index === activeIndex;

                return (
                  <button
                    key={img.id || index}
                    ref={(el) => {
                      thumbRefs.current[index] = el;
                    }}
                    type='button'
                    onClick={() => navigate(index)}
                    aria-label={t('a11y.goToSlide', { number: index + 1 })}
                    aria-current={isActive}
                    className={cn(
                      'bg-bege-dark relative h-14 w-20 shrink-0 overflow-hidden rounded-lg transition duration-300 sm:h-16 sm:w-24 lg:h-20 lg:w-28',
                      'focus-visible:ring-green focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden',
                      isActive
                        ? 'ring-green opacity-100 ring-2 ring-offset-2'
                        : 'opacity-55 grayscale hover:opacity-100 hover:grayscale-0'
                    )}
                  >
                    <ImageMedia
                      src={image.url}
                      alt=''
                      fill
                      className='object-cover'
                      sizes='112px'
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </HawkStarsSection>
  );
};
