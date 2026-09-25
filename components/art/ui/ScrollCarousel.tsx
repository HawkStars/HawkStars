'use client';

import { Children, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { cn } from '@/lib/utils';
import { GALLERY_ROTATION_MS } from './constants';

type ScrollCarouselProps = {
  children: ReactNode;
  previousLabel: string;
  nextLabel: string;
  /** Tailwind width classes for each slide. */
  itemClassName?: string;
  /** Rotate automatically (every GALLERY_ROTATION_MS). */
  autoplay?: boolean;
};

/**
 * Horizontal scroll-snap carousel. Server-rendered slides are passed as
 * children, so this only adds the arrows, dots and optional auto-rotation
 * (paused while the pointer is over the cards, and for reduced motion).
 */
export function ScrollCarousel({
  children,
  previousLabel,
  nextLabel,
  itemClassName = 'w-[85%] sm:w-[48%] lg:w-[calc((100%-4rem)/3)]',
  autoplay = false,
}: ScrollCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);
  const slides = Children.toArray(children);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const total = Math.max(1, Math.ceil(track.scrollWidth / track.clientWidth - 0.05));
    setPages(total);
    setPage(Math.round(track.scrollLeft / track.clientWidth));
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const scrollBy = useCallback((direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
    if (direction === 1 && atEnd) track.scrollTo({ left: 0, behavior: 'smooth' });
    else track.scrollBy({ left: direction * track.clientWidth, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!autoplay || paused || pages < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => scrollBy(1), GALLERY_ROTATION_MS);
    return () => window.clearInterval(id);
  }, [autoplay, paused, pages, scrollBy]);

  return (
    <div>
      <div
        ref={trackRef}
        onScroll={measure}
        // Rotation pauses only while the pointer is over the cards themselves.
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className='flex snap-x snap-mandatory [scrollbar-width:none] gap-8 overflow-x-auto scroll-smooth pb-2 [&::-webkit-scrollbar]:hidden'
      >
        {slides.map((slide, index) => (
          <div key={index} className={cn('shrink-0 snap-start', itemClassName)}>
            {slide}
          </div>
        ))}
      </div>

      {pages > 1 && (
        <div className='border-art-line mt-8 flex items-center justify-between border-t pt-6'>
          <div className='flex items-center gap-2' aria-hidden>
            {Array.from({ length: pages }).map((_, index) => (
              <span
                key={index}
                className={cn(
                  'h-1 rounded-full transition-all',
                  index === page ? 'bg-art-gold-bright w-8' : 'bg-art-pedestal w-2'
                )}
              />
            ))}
          </div>
          <div className='flex gap-3'>
            <CarouselArrow label={previousLabel} onClick={() => scrollBy(-1)}>
              <LuChevronLeft />
            </CarouselArrow>
            <CarouselArrow label={nextLabel} onClick={() => scrollBy(1)}>
              <LuChevronRight />
            </CarouselArrow>
          </div>
        </div>
      )}
    </div>
  );
}

export function CarouselArrow({
  label,
  onClick,
  children,
  className,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type='button'
      aria-label={label}
      onClick={onClick}
      className={cn(
        'border-art-line bg-art-ebony/70 text-art-text hover:border-art-gold-bright hover:text-art-gold-bright flex h-11 w-11 items-center justify-center rounded-full border transition-colors',
        className
      )}
    >
      {children}
    </button>
  );
}
