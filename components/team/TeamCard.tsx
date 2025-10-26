'use client';

import Image from 'next/image';
import Avatar from '../utils/Avatar';
import LinkedinIcon from '@/public/images/icons/socials/linkedin.svg';

import Link from 'next/link';
import { useTranslation } from '../../i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';

type TeamCardProps = {
  name: string;
  title: string;
  photo?: any;
  url?: string;
};

const TeamCard = ({ name, title, photo, url }: TeamCardProps) => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'team');
  return (
    <div className='bg-bege-light flex w-full gap-4 rounded-lg px-2 py-4 text-center lg:h-64 lg:w-56 lg:flex-col lg:gap-0'>
      <div className='mt-2 flex justify-center'>
        <Avatar url={photo} size='medium' />
      </div>
      <div className='mt-3 flex h-full flex-col gap-1 text-left lg:mt-6 lg:text-center'>
        <h4 className='text-body_semibold'>{name}</h4>
        <p className='text-body_regular'>{t(`roles.${title}`)}</p>
        {url && (
          <div className='flex lg:mt-auto lg:justify-center'>
            <Link href={url} target='_blank'>
              <Image src={LinkedinIcon} alt='Linkedin' width={32} height={32} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamCard;
