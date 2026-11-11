'use client';

import React, { useState } from 'react';
import { LuStar, LuQuote, LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import type { ImageType, TestimonialBlock as TestimonialBlockProps } from '@/payload-types';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/i18n/client';
import { Language } from '@/i18n/settings';
import { HawkStarsSection } from '@/components/layout';
import SectionHeader from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/button';
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

type CardStyle = NonNullable<TestimonialBlockProps['style']>;

// `card` and `bubble` are white surfaces on any band; `quote` and `minimal` sit directly on
// the section background and take its text colour.
const SURFACE_STYLES: CardStyle[] = ['card', 'bubble'];

const cardClasses: Record<CardStyle, string> = {
  card: 'card p-6 lg:p-8',
  quote: 'relative p-6',
  minimal: 'p-4',
  bubble: 'card-md relative p-6 lg:p-8',
};

const StarRating: React.FC<{
  rating: number;
  showRating: boolean | null;
  ratingLabel: string;
  onLight: boolean;
}> = ({ rating, showRating, ratingLabel, onLight }) => {
  if (!showRating) return null;

  return (
    // The rating was conveyed entirely through icon colour, so it reached no one
    // using a screen reader.
    <div role='img' aria-label={ratingLabel} className='mb-4 flex items-center gap-1'>
      {Array.from({ length: 5 }, (_, i) => (
        <LuStar
          key={i}
          aria-hidden
          className={cn(
            'size-4',
            i < rating
              ? cn('fill-current', onLight ? 'text-green' : 'text-white')
              : onLight
                ? 'text-black/20'
                : 'text-white/30'
          )}
        />
      ))}
    </div>
  );
};

const TestimonialCard: React.FC<{
  testimonial?: Testimonial;
  style: string | null;
  showRatings: boolean | null;
  isDark: boolean;
  lng: Language;
  className?: string;
}> = ({ testimonial, style, showRatings, isDark, lng, className }) => {
  const { t } = useTranslation(lng, 'common');
  if (!testimonial) return null;

  const { quote, author, rating = 0, featured = false } = testimonial;
  const cardStyle = (style ?? 'card') as CardStyle;
  const onLight = !isDark || SURFACE_STYLES.includes(cardStyle);

  const authorImage = getImagePayloadUrl(author.avatar);

  return (
    <figure
      className={cn(
        'flex h-full flex-col',
        cardClasses[cardStyle] ?? cardClasses.card,
        onLight ? 'text-black' : 'text-white',
        featured && 'ring-green ring-2',
        className
      )}
    >
      {cardStyle === 'quote' && (
        <LuQuote
          aria-hidden
          className={cn('mb-4 size-8', onLight ? 'text-green' : 'text-white/80')}
        />
      )}

      {/* `rating || 1` turned both null and 0 into a one-star score the editor never
          entered. No rating means render nothing. */}
      {typeof rating === 'number' && rating > 0 && (
        <StarRating
          rating={rating}
          showRating={showRatings}
          ratingLabel={t('a11y.starRating', { rating })}
          onLight={onLight}
        />
      )}

      <blockquote
        className={cn(
          'mb-6 flex-1 leading-relaxed',
          cardStyle === 'quote' || featured ? 'text-lg' : 'text-body_regular',
          cardStyle === 'quote' && 'italic',
          onLight ? 'text-black/80' : 'text-white/90'
        )}
      >
        {cardStyle !== 'quote' && '“'}
        {quote}
        {cardStyle !== 'quote' && '”'}
      </blockquote>

      <figcaption className='flex items-center gap-3'>
        {authorImage && (
          <div className='bg-bege-dark relative size-12 shrink-0 overflow-hidden rounded-full'>
            <ImageMedia src={authorImage?.url} alt='' fill sizes='48px' className='object-cover' />
          </div>
        )}
        <div>
          <div className='text-body_semibold'>{author.name}</div>
          {(author.title || author.company) && (
            <div className={cn('text-sm', onLight ? 'text-black/60' : 'text-white/70')}>
              {author.title}
              {author.title && author.company && ` ${t('at')} `}
              {author.company}
            </div>
          )}
        </div>
      </figcaption>

      {cardStyle === 'bubble' && (
        <div
          aria-hidden
          className={cn(
            'absolute bottom-0 left-8 translate-y-full',
            'h-0 w-0 border-t-10 border-r-10 border-l-10',
            'border-t-white border-r-transparent border-l-transparent'
          )}
        />
      )}
    </figure>
  );
};

const backgroundClasses = {
  none: '',
  'light-gray': 'bg-bege-light',
  // The two dark bands from the palette: ink as the alternate band, green as the brand one.
  dark: 'bg-ink text-white',
  brand: 'bg-green text-white',
} as const;

const layoutClasses = {
  single: 'grid grid-cols-1 mx-auto max-w-3xl',
  'two-cols': 'grid grid-cols-1 md:grid-cols-2',
  'three-cols': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  carousel: 'grid grid-cols-1',
  // Real masonry: cards keep their own height and flow down the columns.
  masonry: 'columns-1 md:columns-2 lg:columns-3 [&>*]:mb-6 lg:[&>*]:mb-8',
} as const;

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

  const arrowVariant = isDark ? 'outline-inverse' : 'outline';

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
      {(title || subtitle) && (
        <SectionHeader
          reveal
          align='center'
          title={title}
          subtitle={subtitle}
          variant={isDark ? 'inverse' : 'green'}
          subtitleClassName={cn(isDark && 'text-white/85')}
          className='section-header'
        />
      )}

      {layout === 'carousel' ? (
        <div className='mx-auto max-w-4xl'>
          <TestimonialCard
            lng={lng}
            testimonial={testimonials[currentSlide]}
            style={style}
            showRatings={showRatings}
            isDark={isDark}
          />

          {/* Controls sit under the card rather than over it, so they never cover the
              quote on a phone and every target is at least 44px. */}
          {testimonials.length > 1 && (
            <div className='mt-8 flex items-center justify-center gap-2'>
              <Button
                variant={arrowVariant}
                size='icon-lg'
                className='size-11 rounded-full'
                onClick={prevSlide}
                aria-label={t('a11y.prevSlide')}
              >
                <LuChevronLeft className='size-5' />
              </Button>
              <div className='flex items-center'>
                {testimonials.map((_, index) => (
                  <button
                    type='button'
                    aria-label={t('a11y.goToSlide', { number: index + 1 })}
                    aria-current={index === currentSlide}
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className='group flex h-11 w-6 items-center justify-center'
                  >
                    <span
                      className={cn(
                        'block h-2 rounded-full transition-all',
                        index === currentSlide
                          ? cn('w-5', isDark ? 'bg-white' : 'bg-green')
                          : cn('w-2', isDark ? 'bg-white/40' : 'bg-black/20')
                      )}
                    />
                  </button>
                ))}
              </div>
              <Button
                variant={arrowVariant}
                size='icon-lg'
                className='size-11 rounded-full'
                onClick={nextSlide}
                aria-label={t('a11y.nextSlide')}
              >
                <LuChevronRight className='size-5' />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div
          data-reveal-stagger='up'
          className={cn('gap-6 lg:gap-8', layoutClasses[layout ?? 'three-cols'])}
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              lng={lng}
              key={testimonial.id ?? index}
              testimonial={testimonial}
              style={style}
              showRatings={showRatings}
              isDark={isDark}
              className={layout === 'masonry' ? 'h-auto break-inside-avoid' : undefined}
            />
          ))}
        </div>
      )}
    </HawkStarsSection>
  );
};
