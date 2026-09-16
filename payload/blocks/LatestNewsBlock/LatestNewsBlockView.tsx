'use client';

import React from 'react';
import { LuCalendar, LuArrowRight } from 'react-icons/lu';
import HawkLabel from '@/components/common/hawk-label';
import { ImageMedia } from '@/payload/components/Media';
import { HawkStarsSection } from '@/components/layout';
import { CustomImageProps } from '@/lib/image';
import { Language, toIntlLocale } from '@/i18n/settings';
import { useTranslation } from '@/i18n/client';

export type LatestNewsItem = {
  heading: string;
  badge: string | null;
  date: string | null;
  description: string | null;
  image: Pick<CustomImageProps, 'url' | 'alt'> | null | undefined;
  href: string;
};

export type LatestNewsBlockViewProps = {
  title?: string | null;
  subtitle?: string | null;
  linkLabel?: string | null;
  sectionId?: string | null;
  item: LatestNewsItem;
  lng: Language;
};

// This was hardcoded to 'en-US', so a Portuguese page showed "September 14, 2026".
// `toIntlLocale` is the project's guard against passing a route code straight to Intl.
const formatDate = (dateString: string, lng: Language) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(toIntlLocale(lng), {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

export const LatestNewsBlockView: React.FC<LatestNewsBlockViewProps> = ({
  title,
  subtitle,
  linkLabel,
  sectionId,
  item,
  lng,
}) => {
  const { t } = useTranslation(lng, 'common');

  return (
    <HawkStarsSection
      spacing='default'
      padding='none'
      cap='none'
      container
      id={sectionId || undefined}
      data-blockid='latestNews'
    >
      {(title || subtitle) && (
        <div className='section-header text-center'>
          {title && (
            <h2 className='mb-4 text-3xl font-bold tracking-tight text-balance lg:text-4xl'>
              {title}
            </h2>
          )}
          {subtitle && (
            <p className='mx-auto max-w-2xl text-lg leading-relaxed text-gray-600'>{subtitle}</p>
          )}
        </div>
      )}

      <div className='overflow-hidden rounded-xl'>
        <div className='flex flex-col md:flex-row'>
          {item.image?.url && (
            <div className='relative min-h-96 w-full shrink-0 md:h-auto md:w-1/3'>
              <ImageMedia
                src={item.image.url}
                alt={item.image.alt || item.heading}
                fill
                className='object-contain'
              />
            </div>
          )}

          <div className='flex flex-1 flex-col justify-center p-6 md:p-10'>
            <div className='mb-3 flex flex-wrap items-start gap-3 lg:flex-col'>
              {item.badge && <HawkLabel type={item.badge} variant='green' design='badge' />}
              {item.date && (
                <div className='flex items-center gap-1.5 text-sm text-gray-500'>
                  <LuCalendar className='h-4 w-4' />
                  {formatDate(item.date, lng)}
                </div>
              )}
            </div>

            <h3 className='mb-3 text-2xl font-semibold lg:text-3xl'>{item.heading}</h3>

            {item.description && (
              <p className='mb-4 line-clamp-3 text-gray-700'>{item.description}</p>
            )}

            <a
              href={item.href}
              className='text-green mt-2 inline-flex items-center gap-2 font-medium transition-colors hover:underline'
            >
              {linkLabel || t('blocks.readMore')}
              <LuArrowRight className='h-4 w-4' />
            </a>
          </div>
        </div>
      </div>
    </HawkStarsSection>
  );
};
