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

  return (
    <HawkStarsSection className='bg-bege-light mb-6 gap-8' padding='none' cap='none' spacing='none'>
      <section
        className='w-full bg-linear-to-br from-green-50 to-blue-50 py-16 lg:py-24'
        id={sectionId || undefined}
      >
        <div className='container mx-auto px-4'>
          <div className='grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16'>
            {/* Left Column - Content */}
            <div className='space-y-8'>
              {(viewAgenda || (archiveUrl && viewArchive)) && (
                <div className='flex flex-wrap gap-3'>
                  {viewAgenda && (
                    <Button asChild size='sm' variant='outline'>
                      <Link href={transformUrl(lng, SITE_GET_URLS.agenda)}>
                        <LuCalendarDays className='size-4' />
                        {viewAgenda}
                      </Link>
                    </Button>
                  )}
                  {archiveUrl && viewArchive && (
                    <Button asChild size='sm' variant='outline'>
                      <Link href={transformUrl(lng, archiveUrl)}>
                        <LuArchive className='size-4' />
                        {viewArchive}
                      </Link>
                    </Button>
                  )}
                </div>
              )}

              {badge && (
                <span className='bg-green inline-block rounded-full px-4 py-1.5 text-sm font-semibold text-white'>
                  {badge}
                </span>
              )}

              {title && (
                <h1 className='text-4xl leading-tight font-bold text-gray-900 lg:text-5xl xl:text-6xl'>
                  {title}
                </h1>
              )}

              {subtitle && <p className='text-lg text-gray-600 lg:text-xl'>{subtitle}</p>}

              {/* Impact Stats */}
              {stats && stats.length > 0 && (
                <div className='grid grid-cols-2 gap-6'>
                  {stats.map((stat, index) => {
                    const IconComponent = stat.icon ? getIcon(stat.icon) : null;
                    return (
                      <div key={index} className='space-y-2'>
                        <div className='flex items-center gap-3'>
                          {IconComponent}
                          <span className='text-3xl font-bold text-green-600 lg:text-4xl'>
                            {stat.number}
                          </span>
                        </div>
                        <p className='text-sm font-medium text-gray-700 lg:text-base'>
                          {stat.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* CTA Buttons */}
              {(primaryCTAInfo || secondaryCTAInfo) && (
                <div className='flex flex-col gap-4 sm:flex-row'>
                  {primaryCTAInfo && (
                    <Button
                      size='lg'
                      className='bg-green-700 text-white hover:bg-green-800'
                      asChild
                    >
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
            </div>

            {/* Right Column - Image */}
            {((image && image.url) || video) && (
              <div>
                <div className={cn('relative h-full min-h-75 overflow-hidden rounded-2xl')}>
                  {!image && video && <VideoBlock videoUrl={video} blockType={'videoBlock'} />}
                  {image && (
                    <ImageMedia
                      resource={heroImage}
                      alt={image.alt || t('a11y.impactAlt')}
                      className='absolute h-full w-full object-cover'
                      fill
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </HawkStarsSection>
  );
};

export default HeroImpactStatsBlock;
