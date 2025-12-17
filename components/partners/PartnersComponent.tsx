import Image from 'next/image';
import Link from 'next/link';

import { SocialIcon, SocialType } from '../../utils/models/social';
import { getServerTranslation } from '../../i18n';
import { LanguageProps } from '../types';

import partnersHero from '@/public/images/partners/hero.jpg';
import { HawkStarsSection } from '../layout';

import type { JSX } from 'react';
import { Media, Partner } from '@/payload-types';
import RichText from '@/payload/components/RichText';
import { Map, MapTileLayer } from '@/components/ui/map';
import { LatLngExpression } from 'leaflet';

type PartnersComponentProps = LanguageProps & {
  partners: Partner[];
};

const TORONTO_COORDINATES = [43.6532, -79.3832] satisfies LatLngExpression;

const PartnersComponent = async ({ lng, partners }: PartnersComponentProps) => {
  const { t } = await getServerTranslation(lng, 'partners');
  const nationalPartners = partners.filter((partner) => partner.type == 'national');
  const internationalPartners = partners.filter((partner) => partner.type == 'international');

  return (
    <section>
      <div className='relative z-0 h-60 md:h-96 lg:h-125'>
        <Map center={TORONTO_COORDINATES}>
          <MapTileLayer />
        </Map>
        <Image
          src={partnersHero}
          alt='Hero Partners Page'
          fill={true}
          style={{ objectFit: 'cover', zIndex: 1 }}
        />
      </div>
      <HawkStarsSection>
        {nationalPartners.length > 0 && (
          <div className='mt-10'>
            <h2 className='mb-5 text-center'>{t('national')}</h2>
            <div className='flex gap-5'>
              {nationalPartners.map((partner, index) => (
                <PartnerCard {...partner} key={index} name={t(partner.name)} />
              ))}
            </div>
          </div>
        )}
        {internationalPartners.length > 0 && (
          <div className='mt-10'>
            <h2 className='mb-5 text-center'>{t('internacional')}</h2>
            {internationalPartners.map((partner, index) => (
              <PartnerCard {...partner} key={index} />
            ))}
          </div>
        )}
      </HawkStarsSection>
    </section>
  );
};

const PartnerCard = (partner: Partner): JSX.Element => {
  const { name, description, logo, country, links } = partner;

  return (
    <div className='my-20 flex flex-col gap-5'>
      {/* Country If exists*/}
      {country && (
        <h6 className='border-green text-green w-fit rounded-xl border-2 p-1'>{country}</h6>
      )}
      {/* Title */}
      <h3 className=''>{name}</h3>

      {/* Image */}
      <div className='relative h-36 max-w-xs'>
        <Image
          src={(logo as Media).url as string}
          alt={`${name} logo`}
          fill
          style={{ objectFit: 'contain' }}
        />
      </div>

      {/* Description */}
      {description && <RichText data={description} />}

      {/* Contacts */}
      {links && links.length > 0 && (
        <div className='flex gap-2'>
          <>
            <p className='bold'>Contacts:</p>
            {links.map((link, index) => {
              const icon = link && SocialIcon[link.platform as SocialType];

              return (
                <div key={index}>
                  <Link href={link.url} className='underline' target='_blank'>
                    {icon && (
                      <Image src={icon} alt={`${link.platform} icon`} width={24} height={24} />
                    )}
                  </Link>
                </div>
              );
            })}
          </>
        </div>
      )}
    </div>
  );
};

export default PartnersComponent;
