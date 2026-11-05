import { LuExpand, LuGlobe, LuMoveRight, LuRocket, LuWrench } from 'react-icons/lu';
import type { HeroBlock } from '@/payload-types';

import { Button } from '@/components/ui/button';
import { SectionEyebrow } from '@/components/ui/SectionHeader';
import { getImagePayloadUrl } from '@/lib/image';
import { ImageMedia } from '@/payload/components/Media';
import { getLinkFieldInformation } from '@/utils/page';
import { HawkStarsSection } from '@/components/layout';
import { Language } from '@/i18n/settings';

const iconMap = {
  globe: LuGlobe,
  rocket: LuRocket,
  expand: LuExpand,
  wrench: LuWrench,
};

const HeroBlock: React.FC<HeroBlock & { lng: Language }> = (data) => {
  if (!data) return null;
  const { badge, heading, ctaLink, headerImage, features = [], sectionId, lng } = data;

  const HeadingTag = data.headingLevel === 'h2' ? 'h2' : 'h1';
  // Feature titles sit one level below the hero heading.
  const FeatureHeadingTag = HeadingTag === 'h1' ? 'h2' : 'h3';

  const bgImage = getImagePayloadUrl(headerImage);
  const linkInfo = ctaLink ? getLinkFieldInformation(ctaLink, lng) : undefined;

  return (
    <HawkStarsSection
      spacing='loose'
      padding='none'
      cap='none'
      container
      className='bg-bege-light'
      id={sectionId || undefined}
      data-blockid='hero'
    >
      <div className='mx-auto flex max-w-3xl flex-col items-center text-center'>
        {bgImage && bgImage.url && (
          <ImageMedia
            src={bgImage.url}
            alt={bgImage.alt || ''}
            height={48}
            width={48}
            className='mb-6 aspect-square'
          />
        )}
        {badge && <SectionEyebrow label={badge} />}
        {heading && <HeadingTag className='text-display'>{heading}</HeadingTag>}
        {linkInfo && (
          <Button className='mt-10' size='xl' asChild>
            <a
              href={linkInfo.url}
              target={linkInfo.newTab ? '_blank' : undefined}
              rel={linkInfo.newTab ? 'noopener noreferrer' : undefined}
            >
              {linkInfo.label}
              <LuMoveRight aria-hidden='true' />
            </a>
          </Button>
        )}
      </div>
      {features && features.length > 0 && (
        <ul className='mt-14 grid gap-4 sm:grid-cols-2 md:mt-20 lg:grid-cols-4 lg:gap-6'>
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon as keyof typeof iconMap] || LuGlobe;
            return (
              <li key={feature.id ?? index} className='card flex flex-col gap-4 p-6 md:p-8'>
                <span className='bg-bege-dark text-green flex size-12 shrink-0 items-center justify-center rounded-full'>
                  <IconComponent className='size-6' aria-hidden='true' />
                </span>
                <div className='space-y-2'>
                  <FeatureHeadingTag className='text-h3_semibold'>
                    {feature.title}
                  </FeatureHeadingTag>
                  {feature.description && (
                    <p className='text-body_regular leading-relaxed text-black/70'>
                      {feature.description}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </HawkStarsSection>
  );
};

export { HeroBlock };
