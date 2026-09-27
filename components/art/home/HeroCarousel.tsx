'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { Media } from '@/payload-types';
import { ImageMedia } from '@/payload/components/Media';
import { cn } from '@/lib/utils';
import { CarouselArrow } from '../ui/ScrollCarousel';
import { GALLERY_ROTATION_MS } from '../ui/constants';

export type HeroSlide = {
  id: string;
  href: string;
  title: string;
  artistName?: string;
  year?: number | null;
  specs: string;
  image: Media | null;
};

type HeroCarouselProps = {
  slides: HeroSlide[];
  labels: { previous: string; next: string; goTo: string };
};

/** The spotlit, framed artwork rotation at the top of the gallery home page. */
export default function HeroCarousel({ slides, labels }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  useEffect(() => {
    if (paused || count < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % count), GALLERY_ROTATION_MS);
    return () => window.clearTimeout(id);
  }, [index, paused, count]);

  if (count === 0) return null;
  const slide = slides[index];
  const go = (delta: number) => setIndex((i) => (i + delta + count) % count);

  return (
    <div className='mx-auto w-full max-w-5xl' aria-roledescription='carousel'>
      {/* Picture light */}
      <div aria-hidden className='mx-auto flex w-48 flex-col items-center'>
        <span className='bg-art-muted h-4 w-px' />
        <span className='bg-art-gold shadow-art-gold/30 h-2.5 w-full rounded-full shadow-lg' />
      </div>

      <div className='relative mt-3'>
        {/* Rotation pauses only while the pointer is on the painting itself. */}
        <div
          className='border-art-line bg-art-wall p-3 shadow-2xl shadow-black/70 md:p-4'
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <Link
            href={slide.href}
            className='border-art-brass/70 bg-art-ebony relative block aspect-4/3 overflow-hidden border-2 md:aspect-16/10'
          >
            {slides.map((item, i) =>
              item.image ? (
                <ImageMedia
                  key={item.id}
                  resource={item.image}
                  alt={item.title}
                  fill
                  preload={i === 0}
                  sizes='(max-width: 1024px) 100vw, 1024px'
                  className={cn(
                    'object-contain transition-opacity duration-1000',
                    i === index ? 'opacity-100' : 'opacity-0'
                  )}
                />
              ) : null
            )}
          </Link>
        </div>

        {count > 1 && (
          <>
            <CarouselArrow
              label={labels.previous}
              onClick={() => go(-1)}
              className='absolute top-1/2 -left-2 -translate-y-1/2 md:-left-6'
            >
              <LuChevronLeft />
            </CarouselArrow>
            <CarouselArrow
              label={labels.next}
              onClick={() => go(1)}
              className='absolute top-1/2 -right-2 -translate-y-1/2 md:-right-6'
            >
              <LuChevronRight />
            </CarouselArrow>
          </>
        )}
      </div>

      {/* Museum placard */}
      <div
        aria-live='polite'
        className='border-art-line bg-art-wall mx-auto mt-8 max-w-2xl border px-6 py-5 text-center'
      >
        {slide.artistName && (
          <p className='font-art-sans text-art-gold-bright text-sm tracking-[0.2em] uppercase'>
            {slide.artistName}
          </p>
        )}
        <p className='font-art-serif text-art-text mt-1 text-2xl italic'>
          {[slide.title, slide.year].filter(Boolean).join(', ')}
        </p>
        {slide.specs && <p className='text-art-text-2 mt-2 text-sm'>{slide.specs}</p>}
      </div>

      {count > 1 && (
        <div className='mt-6 flex justify-center gap-2'>
          {slides.map((item, i) => (
            <button
              key={item.id}
              type='button'
              aria-label={labels.goTo.replace('{{n}}', String(i + 1))}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={cn(
                'h-1.5 rounded-full transition-all',
                i === index ? 'bg-art-gold-bright w-8' : 'bg-art-pedestal hover:bg-art-muted w-2'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
