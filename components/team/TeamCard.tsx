'use client';
import { BoardMember } from '@/payload-types';
import { SocialIcon, SocialType } from '@/utils/models/social';
import Link from 'next/link';
import { ImageMedia } from '@/payload/components/Media';
import { LanguageProps } from '../types';
import { useTranslation } from '@/i18n/client';

type TeamCardProps = LanguageProps & {
  member: BoardMember;
};

const TeamCard = ({ member, lng }: TeamCardProps) => {
  const { t } = useTranslation(lng, 'team');
  const { name, photo, title, department, links } = member;

  return (
    <div className='flex flex-col gap-2 text-center'>
      {/* Avatar */}
      {photo && (
        <ImageMedia
          width={128}
          height={128}
          resource={photo}
          alt={name}
          className='mx-auto h-32 w-32 rounded-full object-cover'
        />
      )}
      <div>
        <h3 className='text-foreground mt-2 font-medium'>{name}</h3>
        <p className='text-muted-foreground text-xs capitalize'>{t(`roles.${title}`)}</p>
        {department && <p className='text-muted-foreground text-sm'>{department}</p>}
      </div>

      {links && links.length > 0 && (
        <div className='mt-auto mb-3 flex min-h-5 flex-wrap justify-center gap-2'>
          {/* Social Media Buttons */}
          {links?.map((link, index) => {
            if (!link.isVisible) return null;

            const icon = link && SocialIcon[link.platform as SocialType];
            if (!icon) return null;

            return (
              <Link key={index} href={link.url} target='_blank' rel='noopener noreferrer'>
                <ImageMedia
                  src={icon as string}
                  alt={link.platform}
                  width={24}
                  height={24}
                  className='grayscale'
                />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeamCard;
