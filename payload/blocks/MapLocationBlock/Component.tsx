'use client';

import React from 'react';
import { LuMapPin, LuPhone, LuMail, LuClock } from 'react-icons/lu';
import type { MapLocationBlock as MapLocationBlockProps } from '@/payload-types';
import { HawkStarsSection } from '@/components/layout';
import { Language } from '@/i18n/settings';
import { useTranslation } from '@/i18n/client';
import { cn } from '@/lib/utils';
import type { IconType } from 'react-icons';

// Links get a 44px-tall hit area without changing how the text sits in the row.
const contactLink =
  'text-green hover:text-green-dark inline-flex min-h-11 items-center underline-offset-4 hover:underline';

const ContactRow = ({
  icon: Icon,
  label,
  children,
}: {
  icon: IconType;
  label: string;
  children: React.ReactNode;
}) => (
  <div className='flex gap-4'>
    <span
      aria-hidden='true'
      className='bg-bege-dark text-green flex h-11 w-11 shrink-0 items-center justify-center rounded-full'
    >
      <Icon className='h-5 w-5' />
    </span>
    <div className='text-body_regular min-w-0 text-black/80'>
      <h3 className='text-body_semibold mb-1 text-black'>{label}</h3>
      {children}
    </div>
  </div>
);

export const MapLocationBlock: React.FC<MapLocationBlockProps & { lng: Language }> = ({
  title,
  address,
  latitude,
  longitude,
  phone,
  email,
  hours,
  sectionId,
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
      data-blockid='mapLocation'
    >
      {title && (
        <h2 data-reveal='up' className='text-h2_semibold section-header text-center'>
          {title}
        </h2>
      )}

      <div className='grid gap-6 lg:grid-cols-2 lg:gap-8'>
        {/* Map — 4:3 on mobile so it doesn't push the contact details a full screen down. */}
        <div className='card border-bege-dark overflow-hidden border'>
          <div className='bg-bege-dark aspect-4/3 w-full lg:aspect-square'>
            <iframe
              className='h-full w-full border-0'
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`}
              loading='lazy'
              allowFullScreen
              title={t('a11y.mapRegion')}
            />
          </div>
        </div>

        {/* Contact details as a warm panel with token-coloured icon chips. */}
        <address className='bg-bege-light space-y-6 rounded-xl p-6 not-italic lg:p-8'>
          <ContactRow icon={LuMapPin} label={t('blocks.address')}>
            <p className='whitespace-pre-line'>{address}</p>
          </ContactRow>

          {phone && (
            <ContactRow icon={LuPhone} label={t('blocks.phone')}>
              <a href={`tel:${phone}`} className={contactLink}>
                {phone}
              </a>
            </ContactRow>
          )}

          {email && (
            <ContactRow icon={LuMail} label={t('blocks.email')}>
              <a href={`mailto:${email}`} className={cn(contactLink, 'break-all')}>
                {email}
              </a>
            </ContactRow>
          )}

          {hours && (
            <ContactRow icon={LuClock} label={t('blocks.hours')}>
              <p className='whitespace-pre-line'>{hours}</p>
            </ContactRow>
          )}
        </address>
      </div>
    </HawkStarsSection>
  );
};
