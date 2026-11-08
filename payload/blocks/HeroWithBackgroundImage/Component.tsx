import React from 'react';
import type { HeroWithBackgroundImageBlock } from '@/payload-types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getImagePayloadUrl } from '@/lib/image';
import { getLinkFieldInformation } from '@/utils/page';
import { HawkStarsSection } from '@/components/layout';
import { ImageMedia } from '@/payload/components/Media';
import { Language } from '@/i18n/settings';

// The text column is capped at max-w-4xl, so it also needs placing inside the
// 6xl content column — `items-center` alone centred the text inside a box that
// still sat on the left edge.
const alignmentClasses = {
  left: 'mr-auto text-left items-start',
  center: 'mx-auto text-center items-center',
  right: 'ml-auto text-right items-end',
};

const ctaRowAlignment = {
  left: 'sm:justify-start',
  center: 'sm:justify-center',
  right: 'sm:justify-end',
};

const HeroWithBackgroundImageBlock: React.FC<HeroWithBackgroundImageBlock & { lng: Language }> = (
  data
) => {
  if (!data) return null;
  const HeadingTag = data.headingLevel === 'h2' ? 'h2' : 'h1';

  const {
    backgroundImage,
    title,
    subtitle,
    overlayOpacity = 50,
    links = [],
    textAlignment = 'center',
    sectionId,
    lng,
  } = data;

  const alignment = (textAlignment ?? 'center') as keyof typeof alignmentClasses;
  const bgImage = getImagePayloadUrl(backgroundImage);

  const ctas = (links ?? [])
    .slice(0, 2)
    .map((item) => (item?.link ? getLinkFieldInformation(item.link, lng) : undefined));

  return (
    <HawkStarsSection
      spacing='none'
      padding='none'
      cap='none'
      className='bg-green relative min-h-150 w-full overflow-hidden lg:min-h-175'
      id={sectionId || undefined}
      data-blockid='heroWithBackgroundImage'
    >
      {/* Background Image */}
      {bgImage && bgImage.url && (
        <ImageMedia
          className='animate-ken-burns absolute inset-0 object-cover'
          fill
          src={bgImage.url}
          alt={bgImage.alt ?? ''}
          sizes='100vw'
          preload
        />
      )}

      {/* Overlay — editor-controlled darkness */}
      <div
        aria-hidden='true'
        className='absolute inset-0 bg-black'
        style={{ opacity: (overlayOpacity ?? 50) / 100 }}
      />
      {/* Fixed scrim so white type stays legible on bright photos at any overlay setting. */}
      <div
        aria-hidden='true'
        className='absolute inset-0 bg-linear-to-t from-black/50 via-black/20 to-transparent'
      />
      {/* Brand tint, the same green-to-ink wash as the landing page hero. */}
      <div
        aria-hidden='true'
        className='from-green-dark/40 to-ink/40 absolute inset-0 bg-linear-to-br via-transparent'
      />

      {/* Content */}
      <div className='section-container relative z-10 flex min-h-150 flex-col justify-center py-20 lg:min-h-175 lg:py-28'>
        <div className={cn('flex max-w-4xl flex-col gap-5 lg:gap-6', alignmentClasses[alignment])}>
          {title && (
            <HeadingTag className='text-display animate-rise text-white'>{title}</HeadingTag>
          )}

          {subtitle && (
            <p className='text-h2_light animate-rise max-w-2xl text-white/90 [animation-delay:200ms]'>
              {subtitle}
            </p>
          )}

          {ctas.some(Boolean) && (
            <div
              className={cn(
                'animate-rise mt-2 flex flex-col gap-3 [animation-delay:400ms] sm:flex-row lg:mt-4',
                ctaRowAlignment[alignment]
              )}
            >
              {ctas.map((cta, index) =>
                cta ? (
                  <Button
                    key={index}
                    size='xl'
                    variant={index === 0 ? 'inverse' : 'outline-inverse'}
                    asChild
                  >
                    <a
                      href={cta.url}
                      target={cta.newTab ? '_blank' : undefined}
                      rel={cta.newTab ? 'noopener noreferrer' : undefined}
                    >
                      {cta.label}
                    </a>
                  </Button>
                ) : null
              )}
            </div>
          )}
        </div>
      </div>
    </HawkStarsSection>
  );
};

export { HeroWithBackgroundImageBlock };
