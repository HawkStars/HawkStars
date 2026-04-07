import React from 'react';
import type { CTABannerBlock as CTABannerBlockProps } from '@/payload-types';
import { Button } from '@/components/ui/button';
import { getImagePayloadUrl } from '@/lib/image';
import { getLinkFieldInformation } from '@/utils/page';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';

export const CTABannerBlock: React.FC<CTABannerBlockProps> = ({
  title,
  description,
  links,
  variant = 'centered',
  backgroundImage,
  sectionId,
}) => {
  const lng = useLanguageCookie();
  const bgImage = getImagePayloadUrl(backgroundImage);
  const primaryCta = links && links[0]?.link;
  const secondaryCta = links && links[1]?.link;
  const primaryCTAInfo = primaryCta && getLinkFieldInformation(primaryCta, lng);
  const secondaryCTAInfo = secondaryCta && getLinkFieldInformation(secondaryCta, lng);

  return (
    <section className='py-12 lg:py-20' id={sectionId || ''}>
      <div className='container mx-auto'>
        {variant === 'centered' && (
          <div className='rounded-2xl p-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold lg:text-4xl'>{title}</h2>
            {description && (
              <p className='mx-auto mb-8 max-w-2xl text-lg opacity-90'>{description}</p>
            )}
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              {primaryCTAInfo && (
                <Button size='lg' variant='default' asChild>
                  <a href={primaryCTAInfo.url}>{primaryCTAInfo.label}</a>
                </Button>
              )}
              {secondaryCTAInfo && (
                <Button size='lg' variant='secondary' asChild>
                  <a href={secondaryCTAInfo.url}>{secondaryCTAInfo.label}</a>
                </Button>
              )}
            </div>
          </div>
        )}

        {variant === 'split' && (
          <div className='overflow-hidden rounded-2xl bg-linear-to-br'>
            <div className='flex flex-col gap-8 p-12 text-white lg:flex-row lg:items-center lg:justify-between'>
              <div className='flex-1'>
                <h2 className='mb-4 text-3xl font-bold lg:text-4xl'>{title}</h2>
                {description && <p className='text-lg opacity-90'>{description}</p>}
              </div>
              <div className='flex flex-col gap-4 sm:flex-row lg:shrink-0'>
                {primaryCTAInfo && (
                  <Button size='lg' variant='default' asChild>
                    <a href={primaryCTAInfo.url}>{primaryCTAInfo.label}</a>
                  </Button>
                )}
                {secondaryCTAInfo && (
                  <Button size='lg' variant='secondary' asChild>
                    <a href={secondaryCTAInfo.url}>{secondaryCTAInfo.label}</a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {variant === 'image-bg' && (
          <div
            className='relative overflow-hidden rounded-2xl bg-cover bg-center p-12 text-white'
            style={{
              backgroundImage: bgImage
                ? `url(${bgImage.url})`
                : 'linear-gradient(135deg, #0a7558 0%, #FAE7D0 100%)',
            }}
          >
            <div className='absolute inset-0 bg-black/50' />
            <div className='relative z-10 text-center'>
              <h2 className='mb-4 text-3xl font-bold lg:text-4xl'>{title}</h2>
              {description && <p className='mx-auto mb-8 max-w-2xl text-lg'>{description}</p>}
              <div className='flex flex-col justify-center gap-4 sm:flex-row'>
                {primaryCTAInfo && (
                  <Button size='lg' variant='default' asChild>
                    <a href={primaryCTAInfo.url}>{primaryCTAInfo.label}</a>
                  </Button>
                )}
                {secondaryCTAInfo && (
                  <Button size='lg' variant='secondary' asChild>
                    <a href={secondaryCTAInfo.url}>{secondaryCTAInfo.label}</a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
