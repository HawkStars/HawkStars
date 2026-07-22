'use client';

import { HawkProject, Media, Partner } from '@/payload-types';
import { FC } from 'react';
import { ImageMedia } from '@/payload/components/Media';
import { ProjectSection } from '../utils/ProjectSection';
import { hawkLogo } from '@/utils/models/images/logos';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { Language } from '@/i18n/settings';

type SingleProjectPartnersProps = Pick<HawkProject, 'partnersInformation'> & { lng?: Language };

const SingleProjectPartners: FC<SingleProjectPartnersProps> = ({
  partnersInformation,
  lng: lngProp,
}) => {
  const cookieLng = useLanguageCookie();
  const { t } = useTranslation(lngProp ?? cookieLng, 'projects');
  const { partners } = partnersInformation || {};
  return (
    <>
      {partners && partners.length > 0 && (
        <ProjectSection>
          <h2 className='mb-10 text-4xl font-bold'>{t('sections.partners')}</h2>
          <div className='flex flex-wrap justify-between gap-4'>
            <div className='relative h-32 w-32'>
              <ImageMedia
                src={hawkLogo}
                alt='Hawk logo'
                fill
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                className='items-center object-contain'
              />
            </div>
            {partners.map((partner) => {
              const { logo, name } = partner.partner as Partner;
              const logoUrl = logo ? (logo as Media).url : null;
              if (!logoUrl) return null;

              return (
                <div className='relative h-32 w-32' key={partner.id}>
                  <ImageMedia
                    key={partner.id}
                    src={logoUrl}
                    alt={t('a11y.logoAlt', { name })}
                    fill
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    className='items-center object-contain'
                  />
                </div>
              );
            })}
          </div>
        </ProjectSection>
      )}
    </>
  );
};

export default SingleProjectPartners;
