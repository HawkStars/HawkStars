import Image from 'next/image';
import Link from 'next/link';
import { SocialIcon, SocialType } from '../../utils/models/social';

import { type JSX } from 'react';
import { Media, Partner } from '@/payload-types';
import RichText from '@/payload/components/RichText';
import { FlagIcons } from '@/lib/flags';

const PartnerCard = (partner: Partner): JSX.Element => {
  const { name, description, logo, country, links } = partner;

  const flagIcon = country && FlagIcons[country];
  const url = (logo as Media).url;

  return (
    <div className='border-bege-dark mb-5 flex flex-col gap-3 border-b-2 pb-5'>
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
          <Image
            src={url as string}
            alt={`${name} logo`}
            width={256}
            height={256}
            className='aspect-square rounded-t-2xl object-contain object-center px-6'
          />
        </div>
      )}

      <h3 className='mt-auto text-center'>{name}</h3>
      {/* Description */}
      {description && <RichText data={description} />}

      {/* Contacts */}
      {links && links.length > 0 && (
        <div className='flex justify-center gap-2'>
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

export default PartnerCard;
