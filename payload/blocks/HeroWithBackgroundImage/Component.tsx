import React from 'react';
import type { HeroWithBackgroundImageBlock } from '@/payload-types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getImagePayloadUrl } from '@/lib/image';
import { getLinkFieldInformation } from '@/utils/page';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';

const alignmentClasses = {
  left: 'text-left items-start',
  center: 'text-center items-center',
  right: 'text-right items-end',
};

const HeroWithBackgroundImageBlock: React.FC<HeroWithBackgroundImageBlock> = (data) => {
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
    <section className='relative min-h-150 w-full lg:min-h-175' id={sectionId || ''}>
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
      <div className='relative z-10 container mx-auto flex min-h-150 flex-col justify-center px-4 py-32 lg:min-h-175'>
        <div
          className={cn(
            'flex max-w-4xl flex-col gap-6',
            alignmentClasses[textAlignment as keyof typeof alignmentClasses]
          )}
        >
          {title && (
            <h1 className='text-4xl font-bold text-white lg:text-6xl xl:text-7xl'>{title}</h1>
          )}

          {subtitle && <p className='max-w-2xl text-lg text-white/90 lg:text-xl'>{subtitle}</p>}

          {(primaryCTAInfo || secondaryCTAInfo) && (
            <div className='mt-4 flex flex-col gap-4 sm:flex-row'>
              {primaryCTAInfo && (
                <Button size='lg' className='bg-white text-gray-900 hover:bg-gray-100' asChild>
                  <a href={primaryCTAInfo.url}>{primaryCTAInfo.label}</a>
                </Button>
              )}
              {secondaryCTAInfo && (
                <Button
                  size='lg'
                  variant='outline'
                  className='border-white text-white hover:bg-white/10'
                  asChild
                >
                  <a href={secondaryCTAInfo.url}>{secondaryCTAInfo.label}</a>
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
