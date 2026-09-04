import React from 'react';
import type { HeroWithBackgroundImageBlock } from '@/payload-types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getImagePayloadUrl } from '@/lib/image';
import { getLinkFieldInformation } from '@/utils/page';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { HawkStarsSection } from '@/components/layout';
import { ImageMedia } from '@/payload/components/Media';

const alignmentClasses = {
  left: 'text-left items-start',
  center: 'text-center items-center',
  right: 'text-right items-end',
};

const HeroWithBackgroundImageBlock: React.FC<HeroWithBackgroundImageBlock> = (data) => {
  const HeadingTag = data.headingLevel === 'h2' ? 'h2' : 'h1';
  const lng = useLanguageCookie();
  if (!data) return null;

  const {
    backgroundImage,
    title,
    subtitle,
    overlayOpacity = 50,
    links = [],
    textAlignment = 'center',
    sectionId,
  } = data;

  const bgImage = getImagePayloadUrl(backgroundImage);

  const primaryCta = links && links[0]?.link;
  const secondaryCta = links && links[1]?.link;
  const primaryCTAInfo = primaryCta && getLinkFieldInformation(primaryCta, lng);
  const secondaryCTAInfo = secondaryCta && getLinkFieldInformation(secondaryCta, lng);

  return (
    <HawkStarsSection
      spacing='none'
      padding='none'
      className='relative min-h-150 w-full lg:min-h-175'
      id={sectionId || undefined}
      data-blockid='heroWithBackgroundImage'
    >
      {/* Background Image */}
      {bgImage && bgImage.url && (
        <ImageMedia
          className='absolute inset-0 object-cover'
          fill
          src={bgImage.url}
          alt={bgImage.alt ?? ''}
          preload
        />
      )}

      {/* Overlay */}
      <div
        className='absolute inset-0 bg-black'
        style={{ opacity: (overlayOpacity ?? 50) / 100 }}
      />

      {/* Content */}
      <div className='relative z-10 container mx-auto flex min-h-150 flex-col justify-center px-4 py-32 lg:min-h-175'>
        <div
          className={cn(
            'flex max-w-4xl flex-col gap-6',
            alignmentClasses[textAlignment as keyof typeof alignmentClasses]
          )}
        >
          {title && (
            <HeadingTag className='text-4xl font-bold text-white lg:text-6xl xl:text-7xl'>
              {title}
            </HeadingTag>
          )}

          {subtitle && <p className='max-w-2xl text-lg text-white/90 lg:text-xl'>{subtitle}</p>}

          {(primaryCTAInfo || secondaryCTAInfo) && (
            <div className='mt-4 flex flex-col gap-4 sm:flex-row'>
              {primaryCTAInfo && (
                <Button size='lg' variant='secondary' asChild>
                  <a href={primaryCTAInfo.url}>{primaryCTAInfo.label}</a>
                </Button>
              )}
              {secondaryCTAInfo && (
                <Button size='lg' variant='outline' asChild>
                  <a href={secondaryCTAInfo.url}>{secondaryCTAInfo.label}</a>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </HawkStarsSection>
  );
};

export { HeroWithBackgroundImageBlock };
