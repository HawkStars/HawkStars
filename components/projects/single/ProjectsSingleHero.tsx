'use client';

import { Section } from '@/components/layout/Section';
import { FLAG_PORTUGAL } from '@/lib/constants';
import { FlagIcon } from '@/lib/icon';
import { getImagePayloadUrl } from '@/lib/image';
import { formatCurrency } from '@/lib/utils/currency';
import { HawkProject, Partner } from '@/payload-types';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { ImageMedia } from '@/payload/components/Media';
import { FC } from 'react';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { Language } from '@/i18n/settings';

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
  location,
  lng: lngProp,
}) => {
  const cookieLng = useLanguageCookie();
  const { t } = useTranslation(lngProp ?? cookieLng, 'projects');
  const { projectBadge } = hero || {};
  const { partners } = partnersInformation || {};
  const badgeImage = projectBadge ? getImagePayloadUrl(projectBadge) : null;

  const dateLabel = (() => {
    if (!startDate) return '';
    if (endDate)
      return `${format(startDate, 'd', { locale: pt })} ${t('dateRange.to')} ${format(endDate, "d 'de' MMMM 'de' yyyy", { locale: pt })}`;

    return format(startDate, "d 'de' MMMM 'de' yyyy", { locale: pt });
  })();

  return (
    <Section className='bg-[#eef5f0] pt-32'>
      <div className='mx-auto grid max-w-6xl gap-10 py-5 md:grid-cols-2'>
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
          <h1 className='text-4xl font-bold md:text-5xl'>{heading}</h1>

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
                  <span className='text-xl'>💰</span>
                  <div>
                    <span className='text-2xl font-bold'>{`${formatCurrency(hero.fundedAmount)}€`}</span>
                    <p className='text-sm text-gray-600'>{t('hero.funded')}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Date */}
          {dateLabel && (
            <div className='mt-4 flex items-center gap-2'>
              <svg
                className='h-5 w-5 text-gray-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                />
              </svg>
              <span className='text-lg font-semibold'>{dateLabel}</span>
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
        </div>
      </div>
    </Section>
  );
};

export default ProjectsSingleHero;
