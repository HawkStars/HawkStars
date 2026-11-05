'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { LuChevronLeft, LuChevronRight, LuPause, LuPlay, LuQuote } from 'react-icons/lu';
import type { ProjectTestimonialBlock as ProjectTestimonialBlockProps } from '@/payload-types';
import { cn } from '@/lib/utils';
import { getImagePayloadUrl } from '@/lib/image';
import { ImageMedia } from '@/payload/components/Media';
import { HawkStarsSection } from '@/components/layout';
import { Language } from '@/i18n/settings';
import { useTranslation } from '@/i18n/client';
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';

// 44px round controls over the image, so they're comfortable to tap on a phone.
const navButtonClass =
  'absolute z-20 flex size-11 items-center justify-center rounded-full bg-white/85 text-black shadow-md transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-green focus-visible:outline-none';

const ProjectTestimonialBlock: React.FC<ProjectTestimonialBlockProps & { lng: Language }> = (
  data
) => {
  const {
    title,
    subtitle,
    author,
    testimonial,
    projectMedia,
    layout = 'imageRight',
    backgroundColor = 'none',
    sectionId,
    lng,
  } = data;

  const { t } = useTranslation(lng, 'common');

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const images = projectMedia?.images || [];
  const displayMode = projectMedia?.displayMode || 'single';
  const autoplay = projectMedia?.autoplay ?? true;
  const autoplayInterval = projectMedia?.autoplayInterval ?? 4000;

  const backgroundClasses = {
    none: '',
    light: 'bg-bege-light',
    // Ink is the palette's alternate dark band; brand is a soft green tint.
    dark: 'bg-ink',
    brand: 'bg-green/10',
  };

  const textClasses = {
    none: 'text-black',
    light: 'text-black',
    dark: 'text-white',
    brand: 'text-black',
  };

  const subtitleClasses = {
    none: 'text-black/70',
    light: 'text-black/70',
    dark: 'text-white/80',
    brand: 'text-black/70',
  };

  const isDark = backgroundColor === 'dark';

  const goToImage = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentImageIndex(index);
      setTimeout(() => setIsTransitioning(false), 300);
    },
    [isTransitioning]
  );

  const nextImage = useCallback(() => {
    goToImage((currentImageIndex + 1) % images.length);
  }, [currentImageIndex, images.length, goToImage]);

  const prevImage = useCallback(() => {
    goToImage((currentImageIndex - 1 + images.length) % images.length);
  }, [currentImageIndex, images.length, goToImage]);

  // WCAG 2.2.2 (Level A): content that moves by itself for more than five
  // seconds needs a mechanism to pause it. This block autoplayed every 4s with
  // no control and no reduced-motion check, while both sibling slideshow blocks
  // had had exactly this treatment applied.
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isPlaying, setIsPlaying] = useState(true);
  const isSlideshow = displayMode === 'slideshow' && images.length > 1;
  const isAutoplaying = isSlideshow && Boolean(autoplay) && isPlaying && !prefersReducedMotion;

  useEffect(() => {
    if (!isAutoplaying) return;

    const interval = setInterval(nextImage, autoplayInterval);
    return () => clearInterval(interval);
  }, [isAutoplaying, autoplayInterval, nextImage]);

  const profileImage = getImagePayloadUrl(author.profileImage);

  const renderProjectMedia = () => {
    if (images.length === 0) return null;

    if (displayMode === 'single') {
      const img = images[0];

      if (!img?.image) return;
      const mediaImage = getImagePayloadUrl(img.image);
      if (!mediaImage) return null;

      return (
        <div className='card-md relative aspect-4/3 w-full overflow-hidden'>
          {mediaImage?.url && (
            <ImageMedia
              src={mediaImage.url}
              alt={mediaImage.alt || ''}
              fill
              className='object-cover'
            />
          )}
          {mediaImage.alt && (
            <div className='absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-4'>
              <p className='text-sm text-white'>{mediaImage.alt}</p>
            </div>
          )}
        </div>
      );
    }

    // Slideshow mode
    return (
      <div className='card-md relative aspect-4/3 w-full overflow-hidden'>
        {images.map((img, index: number) => {
          const mediaImage = getImagePayloadUrl(img.image);
          if (!mediaImage) return null;

          return (
            <div
              key={img.id || index}
              className={cn(
                'absolute inset-0 transition-opacity duration-300',
                index === currentImageIndex ? 'z-10 opacity-100' : 'z-0 opacity-0'
              )}
            >
              {mediaImage?.url && (
                <ImageMedia
                  src={mediaImage.url}
                  alt={mediaImage.alt || ''}
                  fill
                  className='object-cover'
                />
              )}
              {mediaImage.alt && (
                <div className='absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-4'>
                  <p className='text-sm text-white'>{mediaImage.alt}</p>
                </div>
              )}
            </div>
          );
        })}

        {isSlideshow && Boolean(autoplay) && !prefersReducedMotion && (
          <button
            type='button'
            onClick={() => setIsPlaying((playing) => !playing)}
            className={cn(navButtonClass, 'top-2 right-2')}
            aria-label={isPlaying ? t('a11y.pauseSlideshow') : t('a11y.playSlideshow')}
          >
            {isPlaying ? <LuPause className='size-4' /> : <LuPlay className='size-4' />}
          </button>
        )}

        {/* Slideshow Navigation */}
        {images.length > 1 && (
          <>
            <button
              type='button'
              onClick={prevImage}
              className={cn(navButtonClass, 'top-1/2 left-2 -translate-y-1/2')}
              aria-label={t('a11y.prevImage')}
            >
              <LuChevronLeft className='size-5' />
            </button>
            <button
              type='button'
              onClick={nextImage}
              className={cn(navButtonClass, 'top-1/2 right-2 -translate-y-1/2')}
              aria-label={t('a11y.nextImage')}
            >
              <LuChevronRight className='size-5' />
            </button>

            {/* Dots */}
            <div className='absolute bottom-1 left-1/2 z-20 flex -translate-x-1/2'>
              {images.map((_, index) => (
                <button
                  type='button'
                  key={index}
                  onClick={() => goToImage(index)}
                  className='group flex h-11 w-6 items-center justify-center'
                  aria-label={t('a11y.goToSlide', { number: index + 1 })}
                  aria-current={index === currentImageIndex}
                >
                  <span
                    className={cn(
                      'block h-2 rounded-full shadow-sm transition-all',
                      index === currentImageIndex
                        ? 'w-4 bg-white'
                        : 'w-2 bg-white/60 group-hover:bg-white/80'
                    )}
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  const testimonialContent = (
    <div className='flex flex-col justify-center'>
      {/* Quote Icon */}
      <LuQuote
        aria-hidden
        className={cn('mb-4 size-10', isDark ? 'text-white/70' : 'text-green')}
      />

      {/* Testimonial Text */}
      <blockquote
        className={cn(
          'mb-8 max-w-prose text-xl leading-relaxed font-medium italic lg:text-2xl',
          textClasses[backgroundColor as keyof typeof textClasses]
        )}
      >
        {`“${testimonial}”`}
      </blockquote>

      {/* Author Info */}
      <div className='flex items-center gap-4'>
        {profileImage?.url && (
          <div className='bg-bege-dark relative size-14 shrink-0 overflow-hidden rounded-full'>
            {/* Decorative: the author's name is printed right beside it. */}
            <ImageMedia src={profileImage.url} alt='' fill sizes='56px' className='object-cover' />
          </div>
        )}
        <div>
          <div
            className={cn(
              'text-h3_semibold',
              textClasses[backgroundColor as keyof typeof textClasses]
            )}
          >
            {author?.name}
          </div>
          {(author?.role || author?.organization) && (
            <div
              className={cn(
                'text-sm',
                subtitleClasses[backgroundColor as keyof typeof subtitleClasses]
              )}
            >
              {author?.role}
              {author?.role && author?.organization && ' • '}
              {author?.organization}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (!data) return null;

  return (
    <HawkStarsSection
      spacing='default'
      padding='none'
      cap='none'
      container
      className={cn(backgroundClasses[backgroundColor as keyof typeof backgroundClasses])}
      id={sectionId || undefined}
      data-blockid='projectTestimonialBlock'
    >
      {/* Section Header */}
      {(title || subtitle) && (
        <header className='section-header text-center'>
          {title && (
            <h2
              className={cn(
                'text-h2_semibold',
                textClasses[backgroundColor as keyof typeof textClasses]
              )}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p
              className={cn(
                'text-h2_light mx-auto mt-4 max-w-2xl',
                subtitleClasses[backgroundColor as keyof typeof subtitleClasses]
              )}
            >
              {subtitle}
            </p>
          )}
        </header>
      )}

      {/* Main Content */}
      <div
        className={cn(
          'grid items-center gap-8 lg:grid-cols-2 lg:gap-16',
          layout === 'imageLeft' && 'lg:grid-flow-dense'
        )}
      >
        {/* Testimonial */}
        <div className={cn(layout === 'imageLeft' && 'lg:col-start-2')}>{testimonialContent}</div>

        {/* Project Media */}
        <div className={cn(layout === 'imageLeft' && 'lg:col-start-1')}>{renderProjectMedia()}</div>
      </div>
    </HawkStarsSection>
  );
};

export { ProjectTestimonialBlock };
