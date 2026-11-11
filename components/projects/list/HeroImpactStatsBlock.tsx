'use client';

import React from 'react';
import Link from 'next/link';
import { LuArchive, LuCalendarDays } from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { ImageMedia } from '@/payload/components/Media';
import { getImagePayloadUrl } from '@/lib/image';
import { getLinkFieldInformation } from '@/utils/page';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { useTranslation } from '@/i18n/client';
import { getIcon } from '@/lib/icon';
import { VideoBlock } from '@/payload/blocks/VideoBlock/Component';
import { cn } from '@/lib/utils';
import { ImageType, LinkGroupItem } from '@/payload-types';
import { HawkStarsSection } from '@/components/layout';
import { SectionEyebrow } from '@/components/ui/SectionHeader';
import { transformUrl, SITE_GET_URLS } from '@/utils/paths';

type HeroImpactStatsBlockProps = {
  title?: string;
  subtitle?: string | null;
  badge?: string | null;
  heroImage?: ImageType;
  stats?: Array<{ icon?: string | null; number: string; label: string }> | null;
  links?: LinkGroupItem | null;
  sectionId?: string | null;
  video?: string | null;
  // Agenda / archive utility links -- lifted here from SplitListComponent so
  // the list body below isn't dominated by two full-width CTA cards. `viewAgenda`
  // is always the site-wide agenda page; `archiveUrl` + `viewArchive` are
  // per-section (projects vs events), so both are passed in by the page.
  viewAgenda?: string;
  archiveUrl?: string;
  viewArchive?: string;
};

const HeroImpactStatsBlock: React.FC<HeroImpactStatsBlockProps> = (data) => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'projects');

  const {
    badge,
    title,
    subtitle,
    heroImage,
    stats = [],
    links = [],
    sectionId,
    video,
    viewAgenda,
    archiveUrl,
    viewArchive,
  } = data || {};

  const image = getImagePayloadUrl(heroImage);
  const primaryCta = links && links[0]?.link;
  const secondaryCta = links && links[1]?.link;
  const primaryCTAInfo = primaryCta && getLinkFieldInformation(primaryCta, lng);
  const secondaryCTAInfo = secondaryCta && getLinkFieldInformation(secondaryCta, lng);

  const hasMedia = Boolean(image?.url || video);

  return (
    <HawkStarsSection
      spacing='default'
      className='bg-bege-light relative isolate overflow-hidden'
      id={sectionId || undefined}
    >
      <div
        aria-hidden='true'
        className='animate-float bg-bege-dark/60 absolute -top-32 -right-32 -z-10 size-96 rounded-full'
      />

      <div className={cn('grid gap-10 lg:items-center lg:gap-16', hasMedia && 'lg:grid-cols-2')}>
        {/* Left Column - Content */}
        <div className='flex flex-col gap-6'>
          {badge && <SectionEyebrow label={badge} className='mb-0' />}

          {title && <h1 className='text-display'>{title}</h1>}

          {subtitle && <p className='text-h2_light max-w-2xl text-black/70'>{subtitle}</p>}

          {/* Impact Stats */}
          {stats && stats.length > 0 && (
            <dl className='grid grid-cols-2 gap-4'>
              {stats.map((stat, index) => (
                <div key={index} className='card flex flex-col gap-1 bg-white p-5'>
                  <dt className='order-2 text-sm font-medium text-black/70'>{stat.label}</dt>
                  <dd className='text-green order-1 flex items-center gap-2'>
                    {stat.icon && getIcon(stat.icon)}
                    <span className='font-display text-3xl leading-none font-semibold tabular-nums lg:text-4xl'>
                      {stat.number}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {/* CTA Buttons */}
          {(primaryCTAInfo || secondaryCTAInfo) && (
            <div className='flex flex-col gap-3 sm:flex-row'>
              {primaryCTAInfo && (
                <Button size='lg' asChild>
                  <a
                    href={primaryCTAInfo.url}
                    target={primaryCTAInfo.newTab ? '_blank' : undefined}
                    rel={primaryCTAInfo.newTab ? 'noopener noreferrer' : undefined}
                  >
                    {primaryCTAInfo.label}
                  </a>
                </Button>
              )}
              {secondaryCTAInfo && (
                <Button size='lg' variant='outline' asChild>
                  <a
                    href={secondaryCTAInfo.url}
                    target={secondaryCTAInfo.newTab ? '_blank' : undefined}
                    rel={secondaryCTAInfo.newTab ? 'noopener noreferrer' : undefined}
                  >
                    {secondaryCTAInfo.label}
                  </a>
                </Button>
              )}
            </div>
          )}

          {/* Agenda / archive utility links */}
          {(viewAgenda || (archiveUrl && viewArchive)) && (
            <div className='flex flex-wrap gap-x-6 gap-y-2'>
              {viewAgenda && (
                <Link
                  href={transformUrl(lng, SITE_GET_URLS.agenda)}
                  className='text-green inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline'
                >
                  <LuCalendarDays aria-hidden='true' className='size-4' />
                  {viewAgenda}
                </Link>
              )}
              {archiveUrl && viewArchive && (
                <Link
                  href={transformUrl(lng, archiveUrl)}
                  className='text-green inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline'
                >
                  <LuArchive aria-hidden='true' className='size-4' />
                  {viewArchive}
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Image */}
        {hasMedia && (
          <div
            className={cn(
              'card-md relative overflow-hidden',
              // The video embed sets its own 16:9 frame; a photo fills the column.
              image && 'aspect-4/3 lg:aspect-auto lg:h-full lg:min-h-96'
            )}
          >
            {!image && video && (
              <VideoBlock
                videoUrl={video}
                blockType={'videoBlock'}
                enableGutter={false}
                className='my-0'
              />
            )}
            {image && (
              <ImageMedia
                resource={heroImage}
                alt={image.alt || t('a11y.impactAlt')}
                className='object-cover'
                fill
                preload
                sizes='(min-width: 1024px) 560px, 100vw'
              />
            )}
          </div>
        )}
      </div>
    </HawkStarsSection>
  );
};

export default HeroImpactStatsBlock;
