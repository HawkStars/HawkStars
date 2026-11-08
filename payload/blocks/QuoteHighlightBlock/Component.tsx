import React from 'react';
import { LuQuote } from 'react-icons/lu';
import type { QuoteHighlightBlock as QuoteHighlightBlockProps } from '@/payload-types';
import { getImagePayloadUrl } from '@/lib/image';
import { ImageMedia } from '@/payload/components/Media';
import { cn } from '@/lib/utils';
import { HawkStarsSection } from '@/components/layout';

type QuoteStyle = NonNullable<QuoteHighlightBlockProps['style']>;

// Long quotes step down a size so a 300-character testimonial doesn't fill the screen.
const quoteSize = (length: number, large: boolean) =>
  cn({
    [large ? 'text-xl lg:text-3xl' : 'text-xl lg:text-2xl']: length < 150,
    [large ? 'text-lg lg:text-2xl' : 'text-lg lg:text-xl']: length >= 150 && length < 300,
    'text-base lg:text-lg': length >= 300,
  });

const containerStyles: Record<QuoteStyle, string> = {
  centered: 'bg-bege-light max-w-4xl rounded-xl px-6 py-10 text-center sm:px-10 lg:px-16 lg:py-12',
  bordered: 'border-green bg-bege-light max-w-5xl rounded-r-xl border-l-4 p-6 sm:p-8 lg:p-12',
  // Solid green → green-dark: the old fade to bege-dark left white author text unreadable.
  highlighted:
    'from-green to-green-dark max-w-5xl rounded-xl bg-linear-to-br p-6 text-white shadow-md sm:p-8 lg:p-12',
};

const quoteTextStyles: Record<QuoteStyle, string> = {
  centered: 'mb-8 italic text-black/85',
  bordered: 'mb-6 text-black/85',
  highlighted: 'mb-6',
};

const authorTitleStyles: Record<QuoteStyle, string> = {
  centered: 'text-black/70',
  bordered: 'text-black/70',
  highlighted: 'text-white/85',
};

const avatarStyles: Record<QuoteStyle, string> = {
  centered: 'h-12 w-12 ring-2 ring-green/20',
  bordered: 'h-14 w-14',
  highlighted: 'h-14 w-14 border-2 border-white',
};

export const QuoteHighlightBlock: React.FC<QuoteHighlightBlockProps> = ({
  quote,
  author,
  authorTitle,
  authorPhoto,
  style = 'centered',
  sectionId,
}) => {
  const variant: QuoteStyle = style ?? 'centered';
  const authorImage = getImagePayloadUrl(authorPhoto);

  return (
    <HawkStarsSection
      spacing='default'
      padding='none'
      cap='none'
      container
      id={sectionId || undefined}
      data-blockid='quoteHighlight'
    >
      <figure data-reveal='scale' className={cn('mx-auto', containerStyles[variant])}>
        {variant !== 'bordered' && (
          <LuQuote
            aria-hidden='true'
            className={cn(
              'mb-6 h-12 w-12',
              variant === 'centered'
                ? 'text-green mx-auto opacity-60 lg:h-14 lg:w-14'
                : 'opacity-50'
            )}
          />
        )}
        <blockquote
          className={cn(
            'leading-relaxed font-medium text-balance',
            quoteSize(quote.length, variant !== 'bordered'),
            quoteTextStyles[variant]
          )}
        >
          <p>&ldquo;{quote}&rdquo;</p>
        </blockquote>
        <figcaption
          className={cn('flex items-center gap-4', variant === 'centered' && 'justify-center')}
        >
          {authorImage && (
            <div
              className={cn(
                'relative shrink-0 overflow-hidden rounded-full',
                avatarStyles[variant]
              )}
            >
              {/* Decorative: the name sits right next to it, so alt text would repeat it. */}
              <ImageMedia src={authorImage.url || ''} alt='' fill className='object-cover' />
            </div>
          )}
          <div className='text-left'>
            <div className='text-body_semibold'>{author}</div>
            {authorTitle && (
              <div className={cn('text-sm', authorTitleStyles[variant])}>{authorTitle}</div>
            )}
          </div>
        </figcaption>
      </figure>
    </HawkStarsSection>
  );
};
