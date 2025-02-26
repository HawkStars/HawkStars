import Image from 'next/image';
import Link from 'next/link';

import { SocialIcon, SocialType } from '../../utils/models/social';
import { CURRENT_PARTNERS, PartnersInfo } from '../../app/[lng]/partners/config';
import { getServerTranslation } from '../../i18n';
import { LanguageProps } from '../types';

import partnersHero from '@/public/images/partners/hero.jpg';
import MarkdownViewer from '../utils/ReactMarkdownViewer/ReactMarkdownViewer';
import { HawkStarsSection } from '../layout';

import type { JSX } from 'react';

const PartnersComponent = async ({ lng }: LanguageProps) => {
  const { t } = await getServerTranslation(lng, 'partners');
  const nationalPartners = CURRENT_PARTNERS.filter((partner) => partner.type == 'national');

  const internationalPartners = CURRENT_PARTNERS.filter(
    (partner) => partner.type == 'international'
  );

  return (
    <section>
      <div className='relative z-0 h-60 md:h-96 lg:h-[500px]'>
        <Image
          src={partnersHero}
          alt='Hero Partners Page'
          fill={true}
          style={{ objectFit: 'cover', zIndex: 1 }}
        />
      </div>
      <HawkStarsSection>
        <div className='mt-10'>
          <h2 className='mb-5 text-center'>{t('national')}</h2>
          {nationalPartners.map((partner, index) => (
            <PartnerCard {...partner} key={index} description={t(partner.description)} />
          ))}
        </div>
        <div className='mt-10'>
          <h2 className='mb-5 text-center'>{t('internacional')}</h2>
          {internationalPartners.map((partner, index) => (
            <PartnerCard {...partner} key={index} />
          ))}
        </div>
      </HawkStarsSection>
    </section>
  );
};

const PartnerCard = ({
  title,
  image,
  description,
  contacts,
  country = undefined,
}: PartnersInfo): JSX.Element => {
  const renderers = {
    p: (props: any) => <p className='my-2 break-words'>{props.children}</p>,
    h1: (props: any) => <h1 className='text-primary-500'>{props.children}</h1>,
  };

  return (
    <div className='my-20 flex flex-col gap-5'>
      {/* Country If exists*/}
      {country && (
        <h6 className='w-fit rounded-xl border-2 border-green p-1 text-green'>{country}</h6>
      )}
      {/* Title */}
      <h3 className=''>{title}</h3>

      {/* Image */}
      <div className='relative h-36 max-w-xs'>
        <Image src={image} alt={`${title} logo`} fill style={{ objectFit: 'contain' }} />
      </div>

      {/* Description */}
      <div>
        <MarkdownViewer className='text-justify' source={description || ''} />
      </div>

      {/* Contacts */}
      {contacts && contacts.length > 0 && (
        <div className='flex gap-2'>
          <>
            <p className='bold'>Contacts:</p>
            {contacts.map((contact, index) => {
              const icon = contact && SocialIcon[contact.type as SocialType];

              return (
                <div key={index}>
                  <Link href={contact.url} className='underline' target='_blank'>
                    {icon && icon({ size: 24, color: '#0A7558' })}
                  </Link>
                </div>
              );
            })}
          </>
        </div>
      )}
      <div className='mt-5 h-5 bg-bege-light'></div>
    </div>
  );
};

export default PartnersComponent;
