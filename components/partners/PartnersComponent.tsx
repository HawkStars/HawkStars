import Image from 'next/image';
import Link from 'next/link';

import { SocialIcon, SocialType } from '../../utils/models/social';
import { getServerTranslation } from '../../i18n';
import { LanguageProps } from '../types';

import partnersHero from '@/public/images/partners/hero.jpg';
import { HawkStarsSection } from '../layout';

import { type JSX } from 'react';
import { Media, Partner } from '@/payload-types';
import RichText from '@/payload/components/RichText';
import PartnersMapWrapper from './PartnersMapWrapper';
import { FlagIcons } from '@/lib/flags';

type PartnersComponentProps = LanguageProps & {
  partners: Partner[];
};

const PartnersComponent = async ({ lng, partners }: PartnersComponentProps) => {
  const { t } = await getServerTranslation(lng, 'partners');
  const nationalPartners = partners.filter((partner) => partner.type == 'national');
  const internationalPartners = partners.filter((partner) => partner.type == 'international');

  return (
    <section>
      <div className='relative z-0 h-60 md:h-96 lg:h-125'>
        <PartnersMapWrapper />
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
            <div className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4'>
              {nationalPartners.map((partner, index) => (
                <PartnerCard {...partner} key={index} name={t(partner.name)} />
              ))}
            </div>
          </div>
        )}
        {internationalPartners.length > 0 && (
          <div className='mt-10'>
            <h2 className='mb-5 text-center'>{t('internacional')}</h2>
            <div className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4'>
              {internationalPartners.map((partner, index) => (
                <PartnerCard {...partner} key={index} />
              ))}
            </div>
          </div>
        )}
      </HawkStarsSection>
    </section>
  );
};

const PartnerCard = (partner: Partner): JSX.Element => {
  const { name, description, logo, country, links } = partner;

  const flagIcon = country && FlagIcons[country];

  return (
    <div className='bg-bege-dark flex flex-col gap-1 rounded-xl'>
      {/* Country If exists*/}
      {flagIcon && (
        <div className='flex justify-between px-4 pt-2'>
          <h6 className='text-green w-fit p-1'>
            {flagIcon({ title: country, className: 'h-4 w-9' })}
          </h6>
          <h3>{name}</h3>
        </div>
      )}

      {/* Image */}
      <div className='relative min-h-64 w-full rounded-xl'>
        <Image
          src={(logo as Media).url as string}
          alt={`${name} logo`}
          fill
          className='px-6'
          style={{ objectFit: 'cover', borderRadius: '999px' }}
        />
      </div>

      {/* Description */}
      {description && <RichText data={description} />}

      {/* Contacts */}
      {links && links.length > 0 && (
        <div className='flex justify-end gap-1 px-3 py-1'>
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
        </div>
      )}
    </div>
  );
};

export default PartnersComponent;
