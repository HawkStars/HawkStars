'use client';

import React from 'react';
import Image from 'next/image';
import { LuCalendar, LuArrowRight } from 'react-icons/lu';
import HawkLabel from '@/components/common/hawk-label';
import { HawkStarsSection } from '@/components/layout';

export type LatestNewsItem = {
  heading: string;
  badge: string | null;
  date: string | null;
  description: string | null;
  image: { url: string; alt?: string } | null | undefined;
  href: string;
};

export type LatestNewsBlockViewProps = {
  title?: string | null;
  subtitle?: string | null;
  linkLabel?: string | null;
  sectionId?: string | null;
  item: LatestNewsItem;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

export const LatestNewsBlockView: React.FC<LatestNewsBlockViewProps> = ({
  title,
  subtitle,
  linkLabel = 'Read more',
  sectionId,
  item,
}) => {
  return (
    <HawkStarsSection
      spacing='default'
      padding='none'
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
            <div className='relative h-64 w-full shrink-0 md:h-auto md:w-1/3'>
              <Image
                src={item.image.url}
                alt={item.image.alt || item.heading}
                fill
                className='object-cover'
              />
            </div>
          )}

          <div className='flex flex-1 flex-col justify-center p-6 md:p-10'>
            <div className='mb-3 flex flex-wrap items-center gap-3'>
              <>
                {item.badge && <HawkLabel type={item.badge} />}
                {item.date && (
                  <div className='flex items-center gap-1.5 text-sm text-gray-500'>
                    <LuCalendar className='h-4 w-4' />
                    {formatDate(item.date)}
                  </div>
                )}
              </>
            </div>

            <h3 className='mb-3 text-2xl font-semibold lg:text-3xl'>{item.heading}</h3>

            {item.description && (
              <p className='mb-4 line-clamp-3 text-gray-700'>{item.description}</p>
            )}

            <a
              href={item.href}
              className='text-green mt-2 inline-flex items-center gap-2 font-medium transition-colors hover:underline'
            >
              {linkLabel}
              <LuArrowRight className='h-4 w-4' />
            </a>
          </div>
        </div>
      </div>
    </HawkStarsSection>
  );
};
