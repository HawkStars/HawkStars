import React from 'react';
import type { HeroWithBackgroundImageBlock } from '@/payload-types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const HeroWithBackgroundImageBlock: React.FC<HeroWithBackgroundImageBlock> = (data) => {
  if (!data) return null;

  const {
    backgroundImage,
    title,
    subtitle,
    overlayOpacity = 50,
    primaryCtaText,
    primaryCtaLink,
    secondaryCtaText,
    secondaryCtaLink,
    textAlignment = 'center',
  } = data;

  const bgImage = typeof backgroundImage === 'string' ? null : backgroundImage;
  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <section className='relative min-h-[600px] w-full lg:min-h-[700px]'>
      {/* Background Image */}
      {bgImage && bgImage.url && (
        <div
          className='absolute inset-0 bg-cover bg-center bg-no-repeat'
          style={{
            backgroundImage: `url(${bgImage.url})`,
          }}
        />
      )}

      {/* Overlay */}
      <div
        className='absolute inset-0 bg-black'
        style={{ opacity: (overlayOpacity ?? 50) / 100 }}
      />

      {/* Content */}
      <div className='container relative z-10 mx-auto flex min-h-[600px] flex-col justify-center px-4 py-32 lg:min-h-[700px]'>
        <div
          className={cn(
            'flex max-w-4xl flex-col gap-6',
            alignmentClasses[textAlignment as keyof typeof alignmentClasses],
          )}
        >
          {title && (
            <h1 className='text-4xl font-bold text-white lg:text-6xl xl:text-7xl'>{title}</h1>
          )}

          {subtitle && (
            <p className='max-w-2xl text-lg text-white/90 lg:text-xl'>{subtitle}</p>
          )}

          {(primaryCtaText || secondaryCtaText) && (
            <div className='mt-4 flex flex-col gap-4 sm:flex-row'>
              {primaryCtaLink && primaryCtaText && (
                <Button size='lg' className='bg-white text-gray-900 hover:bg-gray-100' asChild>
                  <a href={primaryCtaLink}>{primaryCtaText}</a>
                </Button>
              )}
              {secondaryCtaLink && secondaryCtaText && (
                <Button
                  size='lg'
                  variant='outline'
                  className='border-white text-white hover:bg-white/10'
                  asChild
                >
                  <a href={secondaryCtaLink}>{secondaryCtaText}</a>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export { HeroWithBackgroundImageBlock };
