'use client';

import { FC } from 'react';
import { HawkProject, Media, Partner } from '@/payload-types';
import { ImageMedia } from '@/payload/components/Media';
import { ContentSection } from '@/components/layout';
import { hawkLogo } from '@/utils/models/images/logos';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { Language } from '@/i18n/settings';
import { FlagIcon } from '@/lib/icon';
import { FLAG_PORTUGAL } from '@/lib/constants';
import SectionHeader from '@/components/ui/SectionHeader';

type SingleProjectPartnersProps = Pick<HawkProject, 'partnersInformation'> & { lng?: Language };

const LOGO_CARD =
  'card card-hover group flex flex-col items-center gap-3 bg-white p-5 text-center transition-[translate,box-shadow] duration-300 hover:-translate-y-1';

/** Hawk Stars first, then every partner organisation, each in a logo card with its flag. */
const SingleProjectPartners: FC<SingleProjectPartnersProps> = ({
  partnersInformation,
  lng: lngProp,
}) => {
  const cookieLng = useLanguageCookie();
  const { t } = useTranslation(lngProp ?? cookieLng, 'projects');
  const { partners } = partnersInformation || {};
  if (!partners || partners.length === 0) return null;

  return (
    <ContentSection className='bg-bege-light'>
      <SectionHeader title={t('sections.partners')} className='mb-8' />
      <ul className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5'>
        <li className={LOGO_CARD}>
          <div className='relative h-20 w-full'>
            <ImageMedia
              src={hawkLogo}
              alt='Hawk Stars'
              fill
              sizes='200px'
              className='object-contain'
            />
          </div>
          <FlagIcon country={FLAG_PORTUGAL} />
        </li>
        {partners.map((entry) => {
          const { logo, name, country } = entry.partner as Partner;
          const logoUrl = logo ? (logo as Media).url : null;

          return (
            <li key={entry.id} className={LOGO_CARD}>
              <div className='relative flex h-20 w-full items-center justify-center'>
                {logoUrl ? (
                  <ImageMedia
                    src={logoUrl}
                    alt={t('a11y.logoAlt', { name })}
                    fill
                    sizes='200px'
                    className='object-contain grayscale-25 transition group-hover:grayscale-0'
                  />
                ) : (
                  <span className='text-body_semibold text-black/80'>{name}</span>
                )}
              </div>
              <FlagIcon country={country} />
            </li>
          );
        })}
      </ul>
    </ContentSection>
  );
};

export default SingleProjectPartners;
