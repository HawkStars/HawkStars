import Link from 'next/link';
import { SocialIcon, SocialType } from '../../utils/models/social';

import { Media, Partner } from '@/payload-types';
import { FlagIcons } from '@/lib/flags';
import { ImageMedia } from '@/payload/components/Media';
import { getServerTranslation } from '@/i18n';
import { Language, fallbackLng } from '@/i18n/settings';

type PartnerInfoProps = Pick<Partner, 'name' | 'links'> & { lng: Language };

const PartnerInfo = async ({ name, links, lng }: PartnerInfoProps) => {
  const { t } = await getServerTranslation(lng, 'partners');
  return (
    <>
      <h3 className='mt-auto text-center'>{name}</h3>

      {/* Contacts */}
      {links && links.length > 0 && (
        <div className='mt-auto flex justify-center gap-2 pt-2'>
          {links.map((link, index) => {
            const icon = link && SocialIcon[link.platform as SocialType];

            return (
              <div key={index}>
                <Link
                  href={link.url}
                  className='underline'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {icon && (
                    <ImageMedia
                      src={icon}
                      alt={t('a11y.platformIcon', { platform: link.platform })}
                      width={24}
                      height={24}
                    />
                  )}
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

const PartnerCard = async (partner: Partner & { lng?: Language }) => {
  const { name, logo, country, links, lng = fallbackLng } = partner;
  const { t } = await getServerTranslation(lng, 'partners');

  const flagIcon = country && FlagIcons[country];
  const url = (logo as Media).url;

  return (
    <div className='border-bege-dark mb-5 flex flex-col justify-between gap-5 border-b-2 pb-5'>
      {/* Country If exists*/}
      {flagIcon && (
        <div className='flex justify-center px-4 pt-2'>
          <h6 className='text-green bg-bege-dark w-fit rounded-xl p-2 shadow-2xs'>
            {flagIcon({ title: country, className: 'w-8' })}
          </h6>
        </div>
      )}

      {/* Image */}
      {url && (
        <div className='flex justify-center pb-4'>
          <ImageMedia
            src={url as string}
            alt={t('a11y.logoAlt', { name })}
            width={192}
            height={192}
            sizes='95vw'
            className='w-auto rounded-t-2xl object-center px-6'
          />
        </div>
      )}

      <div className='flex gap-2 px-4 lg:flex-col'>
        <div className='flex w-full justify-around lg:flex-col'>
          <PartnerInfo name={name} links={links} lng={lng} />
        </div>
      </div>
    </div>
  );
};

export default PartnerCard;
