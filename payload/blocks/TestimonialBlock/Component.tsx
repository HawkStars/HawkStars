'use client';

import React, { useState } from 'react';
import { LuStar, LuQuote, LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import type { ImageType, TestimonialBlock as TestimonialBlockProps } from '@/payload-types';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/i18n/client';
import { Language } from '@/i18n/settings';
import { HawkStarsSection } from '@/components/layout';
import { getImagePayloadUrl } from '@/lib/image';
import { ImageMedia } from '@/payload/components/Media';

type Testimonial = {
  quote: string;
  author: {
    name: string;
    title?: string | null | undefined;
    company?: string | null | undefined;
    avatar?: ImageType;
  };
  rating?: number | null;
  featured?: boolean | null;
  id?: string | null;
};

const StarRating: React.FC<{ rating: number; showRating: boolean | null; ratingLabel: string }> = ({
  rating,
  showRating,
  ratingLabel,
}) => {
  if (!showRating) return null;

  return (
    // The rating was conveyed entirely through icon colour, so it reached no one
    // using a screen reader.
    <div role='img' aria-label={ratingLabel} className='mb-3 flex items-center gap-1'>
      {Array.from({ length: 5 }, (_, i) => (
        <LuStar
          key={i}
          className={cn('h-4 w-4', i < rating ? 'text-green fill-current' : 'text-gray-500')}
        />
      ))}
    </div>
  );
};

const TestimonialCard: React.FC<{
  testimonial: Testimonial;
  style: string | null;
  showRatings: boolean | null;
  isDark: boolean;
  lng: Language;
}> = ({ testimonial, style, showRatings, isDark, lng }) => {
  const { t } = useTranslation(lng, 'common');
  const { quote, author, rating = 0, featured = false } = testimonial;

  const cardClasses = {
    card: `rounded-lg shadow-md border p-6 ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-200'}`,
    quote: `relative p-6 ${isDark ? 'text-white' : ''}`,
    minimal: `p-4 ${isDark ? 'text-white' : ''}`,
    bubble: `rounded-2xl shadow-lg p-6 relative ${isDark ? 'bg-gray-800 text-white' : 'bg-white'}`,
  };

  const authorImage = getImagePayloadUrl(author.avatar);

  return (
    <div
      className={cn(
        cardClasses[(style ?? 'card') as keyof typeof cardClasses],
        featured && 'ring-opacity-50 ring-green ring-2',
        'h-full'
      )}
    >
      {/* Quote Icon for quote style */}
      {style === 'quote' && <LuQuote className='text-green mb-4 h-8 w-8' />}

      {/* Rating */}
      {/* `rating || 1` turned both null and 0 into a one-star score the editor never
          entered. No rating means render nothing. */}
      {typeof rating === 'number' && rating > 0 && (
        <StarRating
          rating={rating}
          showRating={showRatings}
          ratingLabel={t('a11y.starRating', { rating })}
        />
      )}

      {/* Quote */}
      <blockquote
        className={cn('mb-6', style === 'quote' && 'text-lg italic', featured && 'text-lg')}
      >
        {style !== 'quote' && '"'}
        {quote}
        {style !== 'quote' && '"'}
      </blockquote>

      {/* Author */}
      <div className='flex items-center gap-3'>
        {authorImage && (
          <div className='relative h-10 w-10 shrink-0 overflow-hidden rounded-full'>
            <ImageMedia src={authorImage?.url} alt={author.name} fill className='object-cover' />
          </div>
        )}
        <div>
          <div className={cn('font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
            {author.name}
          </div>
          {(author.title || author.company) && (
            <div className={cn('text-sm', isDark ? 'text-gray-300' : 'text-gray-600')}>
              {author.title}
              {author.title && author.company && ` ${t('at')} `}
              {author.company}
            </div>
          )}
        </div>
      </div>

      {/* Bubble tail for bubble style */}
      {style === 'bubble' && (
        <div
          className={cn(
            'absolute bottom-0 left-6 translate-y-full transform',
            'h-0 w-0 border-t-10 border-r-10 border-l-10',
            'border-r-transparent border-l-transparent',
            isDark ? 'border-t-gray-800' : 'border-t-white'
          )}
        />
      )}
    </div>
  );
};

export const TestimonialBlock = ({
  title,
  subtitle,
  testimonials = [],
  layout = 'three-cols',
  style = 'card',
  showRatings = true,
  backgroundColor = 'none',
  sectionId,
  lng,
}: TestimonialBlockProps & { lng: Language }) => {
  const { t } = useTranslation(lng, 'common');
  const [currentSlide, setCurrentSlide] = useState(0);

  const backgroundClasses = {
    none: '',
    'light-gray': 'bg-gray-50',
    dark: 'bg-gray-900',
    brand: 'bg-gradient-to-br from-blue-500 to-green-500',
  };

  const layoutClasses = {
    single: 'grid-cols-1',
    'two-cols': 'grid-cols-1 md:grid-cols-2',
    'three-cols': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    carousel: 'grid-cols-1',
    masonry: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  };

  const isDark = backgroundColor === 'dark' || backgroundColor === 'brand';

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <HawkStarsSection
      spacing='default'
      padding='none'
      cap='none'
      container
      className={cn(backgroundColor && backgroundClasses[backgroundColor])}
      id={sectionId || undefined}
      data-blockid='testimonialBlock'
    >
      {/* Header */}
      {(title || subtitle) && (
        <div className='section-header text-center'>
          {title && (
            <h2
              className={cn(
                'mb-4 text-3xl font-bold tracking-tight text-balance lg:text-4xl',
                isDark ? 'text-white' : 'text-gray-900'
              )}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p
              className={cn(
                'text-lg leading-relaxed lg:text-xl',
                isDark ? 'text-gray-300' : 'text-gray-600'
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Testimonials */}
      {layout === 'carousel' ? (
        <div className='relative'>
          <div className='mx-auto max-w-4xl'>
            <TestimonialCard
              lng={lng}
              testimonial={testimonials[currentSlide]}
              style={style}
              showRatings={showRatings}
              isDark={isDark}
            />
          </div>

          {testimonials.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className={cn(
                  'absolute top-1/2 left-0 -translate-y-1/2 transform',
                  'flex h-10 w-10 items-center justify-center rounded-full',
                  'card-lg card-hover-lg',
                  isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                )}
                aria-label={t('a11y.prevSlide')}
              >
                <LuChevronLeft className='h-5 w-5' />
              </button>
              <button
                onClick={nextSlide}
                className={cn(
                  'absolute top-1/2 right-0 -translate-y-1/2 transform',
                  'flex h-10 w-10 items-center justify-center rounded-full',
                  'card-lg card-hover-lg',
                  isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                )}
                aria-label={t('a11y.nextSlide')}
              >
                <LuChevronRight className='h-5 w-5' />
              </button>

              {/* Dots indicator */}
              <div className='mt-8 flex justify-center gap-2'>
                {testimonials.map((_, index) => (
                  <button
                    aria-label={t('a11y.goToSlide', { number: index + 1 })}
                    aria-current={index === currentSlide}
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={cn(
                      'h-2 w-2 rounded-full transition-colors',
                      index === currentSlide
                        ? isDark
                          ? 'bg-white'
                          : 'bg-gray-900'
                        : isDark
                          ? 'bg-gray-600'
                          : 'bg-gray-400'
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div
          className={cn(
            'grid gap-6 lg:gap-8',
            layout && layoutClasses[layout],
            layout === 'masonry' && 'auto-rows-auto'
          )}
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              lng={lng}
              key={index}
              testimonial={testimonial}
              style={style}
              showRatings={showRatings}
              isDark={isDark}
            />
          ))}
        </div>
      )}
    </HawkStarsSection>
  );
};
