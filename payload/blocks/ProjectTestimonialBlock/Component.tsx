/* eslint-disable */
// TODO: fix the linter
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import type { ProjectTestimonialBlock as ProjectTestimonialBlockProps } from '@/payload-types';
import { cn } from '@/lib/utils';
import { getImagePayloadUrl } from '@/lib/image';

const ProjectTestimonialBlock: React.FC<ProjectTestimonialBlockProps> = (data) => {
  if (!data) return null;

  const {
    title,
    subtitle,
    author,
    testimonial,
    projectMedia,
    layout = 'imageRight',
    backgroundColor = 'none',
  } = data;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const images = projectMedia?.images || [];
  const displayMode = projectMedia?.displayMode || 'single';
  const autoplay = projectMedia?.autoplay ?? true;
  const autoplayInterval = projectMedia?.autoplayInterval ?? 4000;

  const backgroundClasses = {
    none: '',
    light: 'bg-gray-50',
    dark: 'bg-gray-900',
    brand: 'bg-green/10',
  };

  const textClasses = {
    none: 'text-gray-900',
    light: 'text-gray-900',
    dark: 'text-white',
    brand: 'text-gray-900',
  };

  const subtitleClasses = {
    none: 'text-gray-600',
    light: 'text-gray-600',
    dark: 'text-gray-300',
    brand: 'text-gray-700',
  };

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

  useEffect(() => {
    if (displayMode !== 'slideshow' || !autoplay || images.length <= 1) return;

    const interval = setInterval(nextImage, autoplayInterval);
    return () => clearInterval(interval);
  }, [displayMode, autoplay, autoplayInterval, nextImage, images.length]);

  const profileImage = getImagePayloadUrl(author.profileImage);

  const renderProjectMedia = () => {
    if (images.length === 0) return null;

    if (displayMode === 'single') {
      const img = images[0];
      const mediaImage = getImagePayloadUrl(img.image);
      if (!mediaImage) return null;

      return (
        <div className='relative aspect-4/3 w-full overflow-hidden rounded-2xl'>
          {mediaImage?.url && (
            <Image
              src={mediaImage.url}
              alt={mediaImage.alt || 'Project image'}
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
      <div className='relative aspect-4/3 w-full overflow-hidden rounded-2xl'>
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
                <Image
                  src={mediaImage.url}
                  alt={mediaImage.alt || `Project image ${index + 1}`}
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

        {/* Slideshow Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className='absolute top-1/2 left-2 z-20 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md transition-colors hover:bg-white'
              aria-label='Previous image'
            >
              <ChevronLeft className='h-4 w-4' />
            </button>
            <button
              onClick={nextImage}
              className='absolute top-1/2 right-2 z-20 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md transition-colors hover:bg-white'
              aria-label='Next image'
            >
              <ChevronRight className='h-4 w-4' />
            </button>

            {/* Dots */}
            <div className='absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1.5'>
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={cn(
                    'h-2 w-2 rounded-full transition-all',
                    index === currentImageIndex ? 'w-4 bg-white' : 'bg-white/60 hover:bg-white/80'
                  )}
                  aria-label={`Go to image ${index + 1}`}
                />
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
      <Quote className='text-green mb-4 h-10 w-10' />

      {/* Testimonial Text */}
      <blockquote
        className={cn(
          'mb-8 text-xl leading-relaxed font-medium italic lg:text-2xl',
          textClasses[backgroundColor as keyof typeof textClasses]
        )}
      >
        "{testimonial}"
      </blockquote>

      {/* Author Info */}
      <div className='flex items-center gap-4'>
        {profileImage?.url && (
          <div className='relative h-14 w-14 shrink-0 overflow-hidden rounded-full'>
            <Image
              src={profileImage.url}
              alt={profileImage.alt || author?.name || 'Author'}
              fill
              className='object-cover'
            />
          </div>
        )}
        <div>
          <div
            className={cn(
              'text-lg font-semibold',
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

  return (
    <section
      className={cn(
        'py-16 lg:py-24',
        backgroundClasses[backgroundColor as keyof typeof backgroundClasses]
      )}
    >
      <div className='container mx-auto px-4'>
        {/* Section Header */}
        {(title || subtitle) && (
          <div className='mb-12 text-center'>
            {title && (
              <h2
                className={cn(
                  'mb-4 text-3xl font-bold lg:text-4xl',
                  textClasses[backgroundColor as keyof typeof textClasses]
                )}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className={cn(
                  'mx-auto max-w-2xl text-lg',
                  subtitleClasses[backgroundColor as keyof typeof subtitleClasses]
                )}
              >
                {subtitle}
              </p>
            )}
          </div>
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
          <div className={cn(layout === 'imageLeft' && 'lg:col-start-1')}>
            {renderProjectMedia()}
          </div>
        </div>
      </div>
    </section>
  );
};

export { ProjectTestimonialBlock };
