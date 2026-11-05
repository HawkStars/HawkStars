import React from 'react';
import type { CTABannerBlock as CTABannerBlockProps } from '@/payload-types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getImagePayloadUrl } from '@/lib/image';
import { getLinkFieldInformation } from '@/utils/page';
import { HawkStarsSection } from '@/components/layout';
import SectionHeader from '@/components/ui/SectionHeader';
import { ImageMedia } from '@/payload/components/Media';
import { Language } from '@/i18n/settings';

// Brand band shared by every variant (and the image variant's no-image fallback).
const GREEN_BAND = 'bg-linear-to-br from-green to-green-dark';
const PANEL = 'relative overflow-hidden rounded-xl text-white shadow-md';
const PANEL_PADDING = 'px-6 py-10 sm:px-10 sm:py-12 lg:p-16';

type LinkInformation = NonNullable<ReturnType<typeof getLinkFieldInformation>>;

type CTAButtonsProps = {
  primary?: LinkInformation | '' | null;
  secondary?: LinkInformation | '' | null;
  className?: string;
};

/** Primary + secondary CTA pair. Both sit on a dark band, so they use the inverse variants. */
const CTAButtons = ({ primary, secondary, className }: CTAButtonsProps) => {
  if (!primary && !secondary) return null;
  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row sm:gap-4', className)}>
      {primary && (
        <Button size='xl' variant='inverse' asChild>
          <a
            href={primary.url}
            target={primary.newTab ? '_blank' : undefined}
            rel={primary.newTab ? 'noopener noreferrer' : undefined}
          >
            {primary.label}
          </a>
        </Button>
      )}
      {secondary && (
        <Button size='xl' variant='outline-inverse' asChild>
          <a
            href={secondary.url}
            target={secondary.newTab ? '_blank' : undefined}
            rel={secondary.newTab ? 'noopener noreferrer' : undefined}
          >
            {secondary.label}
          </a>
        </Button>
      )}
    </div>
  );
};

export const CTABannerBlock: React.FC<CTABannerBlockProps & { lng: Language }> = ({
  title,
  description,
  links,
  variant,
  backgroundImage,
  sectionId,
  lng,
}) => {
  // `variant = 'centered'` as a default parameter only caught undefined. The field is
  // `| null`, so any document saved before it existed rendered an empty section with
  // the title, description and both CTAs silently dropped.
  const resolvedVariant = variant ?? 'centered';
  const bgImage = getImagePayloadUrl(backgroundImage);
  const primaryCta = links && links[0]?.link;
  const secondaryCta = links && links[1]?.link;
  const primaryCTAInfo = primaryCta && getLinkFieldInformation(primaryCta, lng);
  const secondaryCTAInfo = secondaryCta && getLinkFieldInformation(secondaryCta, lng);

  return (
    <HawkStarsSection
      spacing='default'
      padding='none'
      cap='none'
      container
      id={sectionId || undefined}
      data-blockid='ctaBanner'
    >
      {resolvedVariant === 'centered' && (
        <div className={cn(PANEL, GREEN_BAND, PANEL_PADDING, 'text-center')}>
          <SectionHeader title={title} variant='inverse' align='center' />
          {description && (
            <p className='mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-white/90'>
              {description}
            </p>
          )}
          <CTAButtons
            primary={primaryCTAInfo}
            secondary={secondaryCTAInfo}
            className='mt-8 justify-center'
          />
        </div>
      )}

      {resolvedVariant === 'split' && (
        <div
          className={cn(
            PANEL,
            GREEN_BAND,
            PANEL_PADDING,
            'flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12'
          )}
        >
          <div className='max-w-2xl flex-1'>
            <SectionHeader title={title} variant='inverse' />
            {description && (
              <p className='mt-4 text-lg leading-relaxed text-white/90'>{description}</p>
            )}
          </div>
          <CTAButtons
            primary={primaryCTAInfo}
            secondary={secondaryCTAInfo}
            className='lg:shrink-0'
          />
        </div>
      )}

      {resolvedVariant === 'image-bg' && (
        <div className={cn(PANEL, GREEN_BAND, PANEL_PADDING, 'text-center')}>
          {bgImage?.url && (
            <>
              <ImageMedia
                src={bgImage.url}
                alt=''
                fill
                sizes='(min-width: 1280px) 1200px, 100vw'
                className='object-cover'
              />
              <div aria-hidden='true' className='absolute inset-0 bg-black/55' />
            </>
          )}
          <div className='relative z-10'>
            <SectionHeader title={title} variant='inverse' align='center' />
            {description && (
              <p className='mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-white/90'>
                {description}
              </p>
            )}
            <CTAButtons
              primary={primaryCTAInfo}
              secondary={secondaryCTAInfo}
              className='mt-8 justify-center'
            />
          </div>
        </div>
      )}
    </HawkStarsSection>
  );
};
