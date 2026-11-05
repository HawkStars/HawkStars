'use client';

import React, { FC, useEffect, useState } from 'react';
import type { SponsorsBlock as SponsorsBlockProps, Sponsor, Media } from '@/payload-types';
import { ImageMedia } from '@/payload/components/Media';
import { fetchSponsors } from '@/lib/payload/client-side/queries/sponsors';
import { HawkStarsSection } from '@/components/layout';
import { useTranslation } from '@/i18n/client';
import { Language } from '@/i18n/settings';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';

export const SponsorsBlock: React.FC<SponsorsBlockProps & { lng?: Language }> = ({
  title,
  subtitle,
  tier,
  limit = 12,
  sectionId,
  lng: lngProp,
}) => {
  const cookieLng = useLanguageCookie();
  const lng = lngProp ?? cookieLng;
  const { t } = useTranslation(lng, 'common');
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    fetchSponsors({ tier, limit }).then(setSponsors);
  }, [tier, limit]);

  if (!sponsors || sponsors.length === 0) return null;

  // Grouped in the order the query returns them; insertion order keeps tiers stable.
  const groupByTier = sponsors.reduce<Record<string, Sponsor[]>>((acc, sponsor) => {
    const key = sponsor.tier || 'other';
    (acc[key] ??= []).push(sponsor);
    return acc;
  }, {});

  return (
    <HawkStarsSection
      spacing='default'
      padding='none'
      cap='none'
      container
      id={sectionId || undefined}
      data-blockid='sponsorsBlock'
    >
      {(title || subtitle) && (
        <header className='section-header text-center'>
          {title && <h2 className='text-h2_semibold'>{title}</h2>}
          {subtitle && <p className='text-h2_light mt-4 text-black/70'>{subtitle}</p>}
        </header>
      )}

      {/* CSS columns keep tiers in reading order on mobile and balance them into a
          two-column masonry on large screens. */}
      <div className='gap-6 lg:columns-2 lg:gap-8'>
        {Object.entries(groupByTier).map(([tierKey, tierSponsors]) => (
          <LogosContainer
            key={tierKey}
            tier={t(`blocks.sponsorTiers.${tierKey}`, { defaultValue: t('label.other') })}
            sponsors={tierSponsors}
          />
        ))}
      </div>
    </HawkStarsSection>
  );
};

type LogosContainerProps = {
  tier: string;
  sponsors: Sponsor[];
};

const LogosContainer: FC<LogosContainerProps> = ({ tier, sponsors }) => (
  <section className='card mb-6 break-inside-avoid p-6 lg:mb-8 lg:p-8'>
    <h3 className='text-h2_bold text-green mb-6'>{tier}</h3>
    <ul className='grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3'>
      {sponsors.map((sponsor) => {
        const logoUrl = (sponsor.logo as Media)?.url;
        const content = (
          <>
            {/* Same 64px frame for every logo so the tier reads as one even row. */}
            <span className='relative flex h-16 w-full items-center justify-center'>
              {logoUrl ? (
                <ImageMedia src={logoUrl} alt='' fill sizes='160px' className='object-contain' />
              ) : (
                <span
                  aria-hidden
                  className='bg-bege-dark text-green flex size-16 items-center justify-center rounded-full text-xl font-semibold'
                >
                  {sponsor.name.charAt(0)}
                </span>
              )}
            </span>
            <span className='text-center text-sm font-medium text-black/80'>{sponsor.name}</span>
          </>
        );

        return (
          <li key={sponsor.id}>
            {sponsor.website ? (
              <a
                href={sponsor.website}
                target='_blank'
                rel='noopener noreferrer'
                className='hover:bg-bege-light focus-visible:ring-green flex flex-col items-center gap-3 rounded-lg p-2 transition-colors focus-visible:ring-2 focus-visible:outline-hidden'
              >
                {content}
              </a>
            ) : (
              <div className='flex flex-col items-center gap-3 p-2'>{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  </section>
);
