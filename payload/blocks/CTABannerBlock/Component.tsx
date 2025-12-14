import React from 'react';
import type { CTABannerBlock as CTABannerBlockProps, Media } from '@/payload-types';
import { Button } from '@/components/ui/button';

export const CTABannerBlock: React.FC<CTABannerBlockProps> = ({
  title,
  description,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  variant = 'centered',
  backgroundImage,
}) => {
  const bgImage = typeof backgroundImage === 'string' ? null : (backgroundImage as Media);

  return (
    <section className='py-12 lg:py-20'>
      <div className='container mx-auto'>
        {variant === 'centered' && (
          <div className='rounded-2xl bg-linear-to-br from-green-600 to-blue-600 p-12 text-center text-white'>
            <h2 className='mb-4 text-3xl font-bold lg:text-4xl'>{title}</h2>
            {description && (
              <p className='mx-auto mb-8 max-w-2xl text-lg opacity-90'>{description}</p>
            )}
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              {primaryButtonLink && primaryButtonText && (
                <Button size='lg' className='bg-white text-green-600 hover:bg-gray-100' asChild>
                  <a href={primaryButtonLink}>{primaryButtonText}</a>
                </Button>
              )}
              {secondaryButtonLink && secondaryButtonText && (
                <Button
                  size='lg'
                  variant='outline'
                  className='border-white text-white hover:bg-white/10'
                  asChild
                >
                  <a href={secondaryButtonLink}>{secondaryButtonText}</a>
                </Button>
              )}
            </div>
          </div>
        )}

        {variant === 'split' && (
          <div className='overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 to-blue-600'>
            <div className='flex flex-col gap-8 p-12 text-white lg:flex-row lg:items-center lg:justify-between'>
              <div className='flex-1'>
                <h2 className='mb-4 text-3xl font-bold lg:text-4xl'>{title}</h2>
                {description && <p className='text-lg opacity-90'>{description}</p>}
              </div>
              <div className='flex flex-col gap-4 sm:flex-row lg:shrink-0'>
                {primaryButtonLink && primaryButtonText && (
                  <Button size='lg' className='bg-white text-green-600 hover:bg-gray-100' asChild>
                    <a href={primaryButtonLink}>{primaryButtonText}</a>
                  </Button>
                )}
                {secondaryButtonLink && secondaryButtonText && (
                  <Button
                    size='lg'
                    variant='outline'
                    className='border-white text-white hover:bg-white/10'
                    asChild
                  >
                    <a href={secondaryButtonLink}>{secondaryButtonText}</a>
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
                : 'linear-gradient(135deg, #0a7558 0%, #1e40af 100%)',
            }}
          >
            <div className='absolute inset-0 bg-black/50' />
            <div className='relative z-10 text-center'>
              <h2 className='mb-4 text-3xl font-bold lg:text-4xl'>{title}</h2>
              {description && <p className='mx-auto mb-8 max-w-2xl text-lg'>{description}</p>}
              <div className='flex flex-col justify-center gap-4 sm:flex-row'>
                {primaryButtonLink && primaryButtonText && (
                  <Button size='lg' className='bg-white text-gray-900 hover:bg-gray-100' asChild>
                    <a href={primaryButtonLink}>{primaryButtonText}</a>
                  </Button>
                )}
                {secondaryButtonLink && secondaryButtonText && (
                  <Button
                    size='lg'
                    variant='outline'
                    className='border-white text-white hover:bg-white/10'
                    asChild
                  >
                    <a href={secondaryButtonLink}>{secondaryButtonText}</a>
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
