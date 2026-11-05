'use client';

import React from 'react';
import Link from 'next/link';
import { LuArrowRight, LuCalendar, LuMapPin } from 'react-icons/lu';
import { HawkStarsSection } from '@/components/layout';
import { ImageMedia } from '@/payload/components/Media';
import { CustomImageProps } from '@/lib/image';
import { Language } from '@/i18n/settings';
import { useTranslation } from '@/i18n/client';
import { formatDateRange } from '@/utils/date';
import { transformUrl } from '@/utils/paths';

export type UpcomingEventItem = {
  heading: string;
  subheading?: string | null;
  description?: string | null;
  /** Already-translated type label. */
  badge: string | null;
  image?: Pick<CustomImageProps, 'url' | 'alt'> | null;
  /** Site path without the locale prefix, e.g. `/events/slug`. */
  href: string;
  /** ISO start date. */
  date?: string | null;
  /** ISO end date, for multi-day events. */
  endDate?: string | null;
  location?: string | null;
};

export type UpcomingHawkEventBlockViewProps = {
  title?: string | null;
  subtitle?: string | null;
  linkLabel?: string | null;
  sectionId?: string | null;
  event: UpcomingEventItem;
  lng?: Language;
};

export const UpcomingHawkEventBlockView: React.FC<UpcomingHawkEventBlockViewProps> = ({
  title,
  subtitle,
  linkLabel,
  sectionId,
  event,
  lng = 'pt',
}) => {
  const { t } = useTranslation(lng, 'common');
  const dateStr = formatDateRange(event.date, event.endDate, lng);

  return (
    <HawkStarsSection
      spacing='default'
      padding='none'
      cap='none'
      container
      id={sectionId || undefined}
      data-blockid='upcomingHawkEvent'
    >
      {(title || subtitle) && (
        <header className='section-header text-center'>
          {title && <h2 className='text-h2_semibold'>{title}</h2>}
          {subtitle && <p className='text-h2_light mt-4 text-black/70'>{subtitle}</p>}
        </header>
      )}

      {/* One featured event: the whole card is the link (via the CTA's ::after). */}
      <article className='card card-hover group focus-within:ring-green relative mx-auto flex max-w-5xl flex-col overflow-hidden focus-within:ring-2 md:flex-row'>
        {event.image?.url && (
          <div className='bg-bege-dark relative aspect-video w-full shrink-0 overflow-hidden md:aspect-auto md:min-h-80 md:w-2/5'>
            <ImageMedia
              src={event.image.url}
              alt={event.image.alt || ''}
              fill
              sizes='(max-width: 768px) 100vw, 40vw'
              className='object-cover transition-transform duration-500 group-hover:scale-105'
            />
          </div>
        )}

        <div className='flex flex-1 flex-col justify-center gap-3 p-6 md:p-10'>
          {event.badge && (
            <span className='bg-terracotta-light text-terracotta-dark w-fit rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase'>
              {event.badge}
            </span>
          )}

          <h3 className='text-h2_bold group-hover:text-green transition-colors'>{event.heading}</h3>

          {event.subheading && <p className='text-lg text-black/70'>{event.subheading}</p>}

          {(dateStr || event.location) && (
            <div className='flex flex-wrap gap-x-5 gap-y-1 text-sm font-medium'>
              {dateStr && (
                <span className='text-terracotta-dark flex items-center gap-1.5'>
                  <LuCalendar aria-hidden className='size-4' />
                  <time dateTime={event.date ?? undefined}>{dateStr}</time>
                </span>
              )}
              {event.location && (
                <span className='flex items-center gap-1.5 text-black/70'>
                  <LuMapPin aria-hidden className='size-4' />
                  {event.location}
                </span>
              )}
            </div>
          )}

          {event.description && (
            <p className='line-clamp-3 max-w-prose leading-relaxed text-black/70'>
              {event.description}
            </p>
          )}

          <Link
            href={transformUrl(lng, event.href)}
            className='text-green mt-2 inline-flex min-h-11 items-center gap-2 self-start font-medium underline-offset-4 group-hover:underline after:absolute after:inset-0 focus-visible:outline-hidden'
          >
            {linkLabel || t('blocks.learnMore')}
            <LuArrowRight
              aria-hidden
              className='size-4 transition-transform group-hover:translate-x-0.5'
            />
          </Link>
        </div>
      </article>
    </HawkStarsSection>
  );
};
