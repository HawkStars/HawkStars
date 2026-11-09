'use client';

import { ContentSection } from '@/components/layout';
import { LuCalendarDays, LuCoins } from 'react-icons/lu';
import { FLAG_PORTUGAL } from '@/lib/constants';
import { FlagIcon } from '@/lib/icon';
import { getImagePayloadUrl } from '@/lib/image';
import { formatCurrency } from '@/lib/utils/currency';
import { HawkDocument, HawkProject, Partner } from '@/payload-types';
import { ImageMedia } from '@/payload/components/Media';
import { FC } from 'react';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { Language } from '@/i18n/settings';
import Link from 'next/link';
import { LuDownload } from 'react-icons/lu';
import { formatDateRange } from '@/utils/date';

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
> & { lng?: Language };

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
  lng: lngProp,
}) => {
  const cookieLng = useLanguageCookie();
  const { t } = useTranslation(lngProp ?? cookieLng, 'projects');
  const { projectBadge } = hero || {};
  const { partners } = partnersInformation || {};
  const badgeImage = projectBadge ? getImagePayloadUrl(projectBadge) : null;
  const infopackDoc = infopack && typeof infopack !== 'string' ? (infopack as HawkDocument) : null;

  // Was always formatted with the Portuguese locale, also on /en.
  const lng = lngProp ?? cookieLng;
  // The activity (with participants) sits inside the wider project period.
  const dateRows = [
    { label: t('dates.project'), value: formatDateRange(projectStartDate, projectEndDate, lng) },
    { label: t('dates.activity'), value: formatDateRange(startDate, endDate, lng) },
  ].filter((row) => row.value);

  return (
    <ContentSection className='bg-green/5 pt-32' spacing='tight'>
      <div className='grid gap-10 md:grid-cols-2'>
        {/* Left column */}
        <div>
          {/* Badge */}
          {badgeImage?.url && (
            <div className='mb-4'>
              <ImageMedia
                resource={projectBadge}
                alt={badgeImage.alt || t('a11y.badgeAlt')}
                width={120}
                height={120}
                className='object-contain'
              />
            </div>
          )}

          {/* Title */}
          <h1 className='text-display'>{heading}</h1>

          {/* Stats row */}
          {(hero?.participants || hero?.fundedAmount) && (
            <div className='mt-6 flex flex-wrap items-center gap-8' data-project-stats>
              {hero.participants && (
                <div className='flex items-center gap-2'>
                  <svg
                    className='h-6 w-6 text-gray-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z'
                    />
                  </svg>
                  <div>
                    <span className='text-2xl font-bold'>{hero.participants}</span>
                    <p className='text-sm text-gray-600'>{t('hero.participants')}</p>
                  </div>
                </div>
              )}
              {hero.fundedAmount && (
                <div className='flex items-center gap-2'>
                  <LuCoins aria-hidden='true' className='text-green size-6 shrink-0' />
                  <div>
                    <span className='text-2xl font-bold'>{formatCurrency(hero.fundedAmount)}</span>
                    <p className='text-sm text-gray-600'>{t('hero.funded')}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Dates */}
          {dateRows.length > 0 && (
            <div className='mt-4 flex flex-col gap-3 sm:flex-row sm:gap-8'>
              {dateRows.map(({ label, value }) => (
                <div key={label} className='flex items-start gap-2'>
                  <LuCalendarDays
                    aria-hidden='true'
                    className='text-green mt-0.5 size-5 shrink-0'
                  />
                  <div className='flex flex-col'>
                    <dt className='text-sm text-gray-600'>{label}</dt>
                    <dd className='text-lg font-semibold'>{value}</dd>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Country flags */}
          {partners && partners.length > 0 && (
            <div className='mt-6 flex flex-wrap gap-3'>
              <FlagIcon country={FLAG_PORTUGAL} />
              {partners.map((c, i) => (
                <FlagIcon key={i} country={(c.partner as Partner).country} />
              ))}
            </div>
          )}
        </div>

        {/* Right column: video + metadata */}
        <div className='flex flex-col gap-4'>
          {/* Video */}
          {hero?.videoUrl && (
            <div className='aspect-video w-full overflow-hidden rounded-lg bg-black'>
              <iframe
                src={hero.videoUrl}
                className='h-full w-full'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
                title={t('a11y.videoTitle')}
              />
            </div>
          )}

          {/* Metadata */}
          <div className='space-y-1 text-sm text-gray-700'>
            {heading && (
              <p>
                <span className='font-semibold'>{t('details.name')}</span> {heading}
              </p>
            )}
            {actionType && (
              <p>
                <span className='font-semibold'>{t('details.actionType')}</span> {actionType}
              </p>
            )}
            {referenceNumber && (
              <p>
                <span className='font-semibold'>{t('details.reference')}</span> {referenceNumber}
              </p>
            )}
            {beneficiary && (
              <p>
                <span className='font-semibold'>{t('details.beneficiary')}</span> {beneficiary}
              </p>
            )}
            {location && (
              <p>
                <span className='font-semibold'>{t('details.location')}</span> {location}
              </p>
            )}
          </div>

          {infopackDoc?.url && (
            <Link
              href={infopackDoc.url}
              target='_blank'
              rel='noopener noreferrer'
              download
              className='bg-primary text-primary-foreground hover:bg-primary/90 mt-2 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors'
            >
              <LuDownload className='h-4 w-4' />
              {t('details.downloadInfopack')}
            </Link>
          )}
        </div>
      </div>
    </ContentSection>
  );
};

export default ProjectsSingleHero;
