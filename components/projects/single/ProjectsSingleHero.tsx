'use client';

import { FC } from 'react';
import Link from 'next/link';
import { LuArrowLeft, LuCalendarDays, LuCoins, LuDownload, LuUsers } from 'react-icons/lu';
import { HawkStarsSection } from '@/components/layout';
import { SectionEyebrow } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/button';
import { FLAG_PORTUGAL } from '@/lib/constants';
import { FlagIcon } from '@/lib/icon';
import { getImagePayloadUrl } from '@/lib/image';
import { formatCurrency } from '@/lib/utils/currency';
import { HawkDocument, HawkProject, Partner } from '@/payload-types';
import { ImageMedia, VideoMedia } from '@/payload/components/Media';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { Language } from '@/i18n/settings';
import { formatDateRange } from '@/utils/date';
import { SITE_GET_URLS, transformUrl } from '@/utils/paths';

type ProjectsSingleHeroProps = Pick<
  HawkProject,
  | 'hero'
  | 'heading'
  | 'partnersInformation'
  | 'actionType'
  | 'referenceNumber'
  | 'beneficiary'
  | 'location'
  | 'startDate'
  | 'endDate'
  | 'projectStartDate'
  | 'projectEndDate'
  | 'infopack'
  | 'coverImage'
> &
  Partial<Pick<HawkProject, 'project_type'>> & { lng?: Language };

// The detail labels are stored with a trailing colon for the old inline layout.
const stripColon = (label: string) => label.replace(/:\s*$/, '');

/**
 * Project page header: a warm band with the type eyebrow, title, impact stats and dates on
 * the left, and the media plus an "official details" card on the right.
 */
const ProjectsSingleHero: FC<ProjectsSingleHeroProps> = ({
  hero,
  heading,
  partnersInformation,
  actionType,
  referenceNumber,
  beneficiary,
  startDate,
  endDate,
  projectStartDate,
  projectEndDate,
  location,
  infopack,
  coverImage,
  project_type,
  lng: lngProp,
}) => {
  const cookieLng = useLanguageCookie();
  const lng = lngProp ?? cookieLng;
  const { t } = useTranslation(lng, 'projects');
  const { projectBadge, participants, fundedAmount, videoUrl } = hero || {};
  const { partners } = partnersInformation || {};
  const badgeImage = projectBadge ? getImagePayloadUrl(projectBadge) : null;
  const cover = coverImage ? getImagePayloadUrl(coverImage) : null;
  const infopackDoc = infopack && typeof infopack !== 'string' ? (infopack as HawkDocument) : null;

  // The activity (with participants) sits inside the wider project period.
  const dateRows = [
    { label: t('dates.project'), value: formatDateRange(projectStartDate, projectEndDate, lng) },
    { label: t('dates.activity'), value: formatDateRange(startDate, endDate, lng) },
  ].filter((row) => row.value);

  const stats = [
    participants
      ? { icon: LuUsers, value: String(participants), label: t('hero.participants') }
      : null,
    fundedAmount
      ? { icon: LuCoins, value: formatCurrency(fundedAmount), label: t('hero.funded') }
      : null,
  ].filter((stat) => stat !== null);

  const details = [
    { label: t('details.actionType'), value: actionType },
    { label: t('details.reference'), value: referenceNumber },
    { label: t('details.beneficiary'), value: beneficiary },
    { label: t('details.location'), value: location },
  ].filter((row) => row.value);

  const hasAside = Boolean(videoUrl || cover?.url || details.length > 0 || infopackDoc?.url);

  return (
    <HawkStarsSection
      spacing='default'
      className='bg-bege-light relative isolate overflow-hidden pt-24 lg:pt-32'
    >
      <div
        aria-hidden='true'
        className='animate-float bg-bege-dark/60 absolute -top-32 -right-32 -z-10 size-96 rounded-full'
      />

      <Link
        href={transformUrl(lng, SITE_GET_URLS.projects)}
        className='text-green mb-8 inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline'
      >
        <LuArrowLeft aria-hidden='true' className='size-4' />
        {t('allProjects')}
      </Link>

      <div className={hasAside ? 'grid gap-10 lg:grid-cols-12 lg:gap-12' : undefined}>
        {/* Left column */}
        <div className='flex flex-col gap-6 lg:col-span-7'>
          {badgeImage?.url && (
            <ImageMedia
              resource={projectBadge}
              alt={badgeImage.alt || t('a11y.badgeAlt')}
              width={96}
              height={96}
              className='size-24 object-contain'
            />
          )}

          <div>
            {project_type && <SectionEyebrow label={t(`types.${project_type}`)} className='mb-4' />}
            <h1 className='text-display'>{heading}</h1>
          </div>

          {stats.length > 0 && (
            <dl className='grid gap-4 min-[420px]:grid-cols-2 sm:max-w-lg' data-project-stats>
              {stats.map(({ icon: Icon, value, label }) => (
                <div key={label} className='card flex min-w-0 flex-col gap-1 bg-white p-5'>
                  <dt className='order-2 text-sm font-medium text-black/70'>{label}</dt>
                  <dd className='text-green order-1 flex items-center gap-2'>
                    <Icon aria-hidden='true' className='size-5 shrink-0' />
                    <span className='font-display text-2xl leading-none font-semibold whitespace-nowrap tabular-nums sm:text-3xl'>
                      {value}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {dateRows.length > 0 && (
            <dl className='flex flex-col gap-4 sm:flex-row sm:gap-10'>
              {dateRows.map(({ label, value }) => (
                // dt/dd must be direct children of the group div, so the icon lives
                // inside the dt and is pinned to the left of the pair.
                <div key={label} className='relative min-h-10 pl-13'>
                  <dt className='text-eyebrow text-black/60'>
                    <span
                      aria-hidden='true'
                      className='bg-bege-dark text-terracotta-dark absolute top-0 left-0 flex size-10 items-center justify-center rounded-full'
                    >
                      <LuCalendarDays className='size-5' />
                    </span>
                    {label}
                  </dt>
                  <dd className='text-body_semibold mt-1'>{value}</dd>
                </div>
              ))}
            </dl>
          )}

          {partners && partners.length > 0 && (
            <div className='flex flex-wrap gap-3'>
              <FlagIcon country={FLAG_PORTUGAL} />
              {partners.map((c, i) => (
                <FlagIcon key={i} country={(c.partner as Partner).country} />
              ))}
            </div>
          )}
        </div>

        {/* Right column: media + official details */}
        {hasAside && (
          <div className='flex flex-col gap-6 lg:col-span-5'>
            {videoUrl ? (
              <div className='card-md relative aspect-video w-full overflow-hidden bg-black'>
                <VideoMedia
                  src={videoUrl}
                  controls
                  title={t('a11y.videoTitle')}
                  videoClassName='absolute inset-0 h-full w-full'
                />
              </div>
            ) : (
              cover?.url && (
                <div className='card-md bg-bege-dark relative aspect-4/3 w-full overflow-hidden'>
                  <ImageMedia
                    resource={coverImage}
                    alt={cover.alt || heading || ''}
                    fill
                    preload
                    sizes='(min-width: 1024px) 460px, 100vw'
                    className='object-cover'
                  />
                </div>
              )
            )}

            {(details.length > 0 || infopackDoc?.url) && (
              <div className='card bg-white p-6'>
                <h2 className='text-eyebrow text-green mb-4'>{t('sections.details')}</h2>
                {details.length > 0 && (
                  <dl className='divide-bege-dark divide-y text-sm'>
                    {details.map(({ label, value }) => (
                      <div key={label} className='flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0'>
                        <dt className='text-black/60'>{stripColon(label)}</dt>
                        <dd className='font-medium break-words'>{value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {infopackDoc?.url && (
                  <Button asChild className='mt-6 w-full sm:w-auto'>
                    <a href={infopackDoc.url} target='_blank' rel='noopener noreferrer' download>
                      <LuDownload aria-hidden='true' />
                      {t('details.downloadInfopack')}
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </HawkStarsSection>
  );
};

export default ProjectsSingleHero;
