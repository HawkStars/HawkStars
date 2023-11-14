'use client';
import Avatar from '../utils/Avatar';
import { BsLinkedin } from 'react-icons/bs';

import Link from 'next/link';

type TeamCardProps = {
  name: string;
  position: string;
  photo: string;
  url?: string;
};

const TeamCard = ({ name, position, photo, url }: TeamCardProps) => {
  const { t } = useTranslation('team');
  return (
    <div className='flex w-full gap-4 bg-bege-light px-2 py-4 text-center lg:h-64 lg:w-56 lg:flex-col lg:gap-0'>
      <div className='mt-2 flex justify-center'>
        <Avatar url={photo} size='medium' />
      </div>
      <div className='mt-3 flex h-full flex-col gap-1 text-left lg:mt-6 lg:text-center'>
        <h4 className='font-black'>{name}</h4>
        <h6>{t(position)}</h6>
        {url && (
          <div className='flex lg:mt-auto lg:justify-center'>
            <Link href={url} target='_blank'>
              <BsLinkedin size={32} color='#0072b1' />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamCard;
