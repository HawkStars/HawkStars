'use client';

import React from 'react';
import { LuCalendar, LuArrowRight } from 'react-icons/lu';
import Link from 'next/link';
import { ImageMedia } from '@/payload/components/Media';
import { HawkStarsSection } from '@/components/layout';
import SectionHeader from '@/components/ui/SectionHeader';
import { CustomImageProps } from '@/lib/image';
import { Language } from '@/i18n/settings';
import { useTranslation } from '@/i18n/client';
import { formatDate } from '@/utils/date';
import { transformUrl } from '@/utils/paths';

export type LatestNewsItem = {
  heading: string;
  badge: string | null;
  date: string | null;
  description: string | null;
  image: Pick<CustomImageProps, 'url' | 'alt'> | null | undefined;
  /** Site path without the locale prefix, e.g. `/news/slug`. */
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
        <SectionHeader
          reveal
          align='center'
          title={title}
          subtitle={subtitle}
          className='section-header'
        />
      )}

      {/* One featured story: the whole card is the link (via the CTA's ::after). */}
      <article className='card card-hover group focus-within:ring-green relative mx-auto flex max-w-5xl flex-col overflow-hidden focus-within:ring-2 md:flex-row'>
        {item.image?.url && (
          <div className='bg-bege-dark relative aspect-4/3 w-full shrink-0 overflow-hidden md:aspect-auto md:min-h-80 md:w-2/5'>
            <ImageMedia
              src={item.image.url}
              alt={item.image.alt || ''}
              fill
              sizes='(max-width: 768px) 100vw, 40vw'
              className='object-cover object-top transition-transform duration-500 group-hover:scale-105'
            />
          </div>
        )}

        <div className='flex flex-1 flex-col justify-center gap-3 p-6 md:p-10'>
          <div className='flex flex-wrap items-center gap-x-3 gap-y-1'>
            {item.badge && (
              <span className='text-eyebrow text-terracotta-dark'>
                {t(`label.${item.badge}`, {
                  defaultValue: t(`blocks.eventTypes.${item.badge}`, {
                    defaultValue: t('label.other'),
                  }),
                })}
              </span>
            )}
            {item.date && (
              <time
                dateTime={item.date}
                className='text-terracotta-dark flex items-center gap-1.5 text-sm font-medium'
              >
                <LuCalendar aria-hidden='true' className='size-4' />
                {formatDate(item.date, lng)}
              </time>
            )}
          </div>

          <h3 className='text-h2_bold group-hover:text-green transition-colors'>{item.heading}</h3>

          {item.description && (
            <p className='line-clamp-3 max-w-prose leading-relaxed text-black/70'>
              {item.description}
            </p>
          )}

          <Link
            href={transformUrl(lng, item.href)}
            className='text-green mt-2 inline-flex min-h-11 items-center gap-2 self-start font-medium underline-offset-4 group-hover:underline after:absolute after:inset-0 focus-visible:outline-hidden'
          >
            {linkLabel || t('blocks.readMore')}
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
