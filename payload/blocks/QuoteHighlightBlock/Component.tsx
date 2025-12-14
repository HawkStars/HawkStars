import React from 'react';
import Image from 'next/image';
import { Quote } from 'lucide-react';
import type { QuoteHighlightBlock as QuoteHighlightBlockProps, Media } from '@/payload-types';
import { cn } from '@/lib/utils';

export const QuoteHighlightBlock: React.FC<QuoteHighlightBlockProps> = ({
  quote,
  author,
  authorTitle,
  authorPhoto,
  style = 'centered',
}) => {
  return (
    <section className='py-12 lg:py-20'>
      <div className='container mx-auto'>
        {style === 'centered' && (
          <div className='mx-auto max-w-3xl text-center'>
            <Quote className='mx-auto mb-6 h-12 w-12 text-green-600' />
            <blockquote className='mb-6 text-2xl font-medium italic leading-relaxed lg:text-3xl'>
              &ldquo;{quote}&rdquo;
            </blockquote>
            <div className='flex items-center justify-center gap-4'>
              {authorPhoto && typeof authorPhoto !== 'string' && (
                <div className='relative h-12 w-12 overflow-hidden rounded-full'>
                  <Image
                    src={(authorPhoto as Media).url || ''}
                    alt={author}
                    fill
                    className='object-cover'
                  />
                </div>
              )}
              <div className='text-left'>
                <div className='font-semibold'>{author}</div>
                {authorTitle && <div className='text-sm text-gray-600'>{authorTitle}</div>}
              </div>
            </div>
          </div>
        )}

        {style === 'bordered' && (
          <div className='mx-auto max-w-4xl border-l-4 border-green-600 bg-gray-50 p-8 lg:p-12'>
            <blockquote className='mb-4 text-xl font-medium leading-relaxed lg:text-2xl'>
              &ldquo;{quote}&rdquo;
            </blockquote>
            <div className='flex items-center gap-4'>
              {authorPhoto && typeof authorPhoto !== 'string' && (
                <div className='relative h-14 w-14 overflow-hidden rounded-full'>
                  <Image
                    src={(authorPhoto as Media).url || ''}
                    alt={author}
                    fill
                    className='object-cover'
                  />
                </div>
              )}
              <div>
                <div className='font-semibold text-gray-900'>{author}</div>
                {authorTitle && <div className='text-sm text-gray-600'>{authorTitle}</div>}
              </div>
            </div>
          </div>
        )}

        {style === 'highlighted' && (
          <div className='mx-auto max-w-4xl rounded-2xl bg-gradient-to-br from-green-500 to-blue-600 p-8 text-white lg:p-12'>
            <Quote className='mb-6 h-12 w-12 opacity-50' />
            <blockquote className='mb-6 text-2xl font-medium leading-relaxed lg:text-3xl'>
              &ldquo;{quote}&rdquo;
            </blockquote>
            <div className='flex items-center gap-4'>
              {authorPhoto && typeof authorPhoto !== 'string' && (
                <div className='relative h-14 w-14 overflow-hidden rounded-full border-2 border-white'>
                  <Image
                    src={(authorPhoto as Media).url || ''}
                    alt={author}
                    fill
                    className='object-cover'
                  />
                </div>
              )}
              <div>
                <div className='font-semibold'>{author}</div>
                {authorTitle && <div className='text-sm opacity-90'>{authorTitle}</div>}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
