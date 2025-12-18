'use client';
import { BoardMember, Media } from '@/payload-types';
import { SocialIcon, SocialType } from '@/utils/models/social';
import Link from 'next/link';
import Image from 'next/image';
import { LanguageProps } from '../types';
import { useTranslation } from '@/i18n/client';

type TeamCardProps = LanguageProps & {
  member: BoardMember;
};

const TeamCard = ({ member, lng }: TeamCardProps) => {
  const links = member.links;
  const { t } = useTranslation(lng, 'team');

  return (
    <div className='flex flex-col gap-2 text-center'>
      {/* Avatar */}
      {member.photo && (
        <Image
          width={128}
          height={128}
          src={(member.photo as Media).url as string}
          alt={member.name}
          className='mx-auto h-32 w-32 object-cover'
          style={{ borderRadius: 999 }}
        />
      )}
      <div>
        <h3 className='text-foreground mt-2 font-medium'>{member.name}</h3>
        <p className='text-muted-foreground text-xs capitalize'>{t(`roles.${member.title}`)}</p>
        {member.department && <p className='text-muted-foreground text-sm'>{member.department}</p>}
      </div>

      {links && links.length > 0 && (
        <div className='mt-3 flex min-h-5 flex-wrap justify-center gap-2'>
          {/* Social Media Buttons */}
          {links?.map((link, index) => {
            if (!link.isVisible) return null;

            const icon = link && SocialIcon[link.platform as SocialType];
            if (!icon) return null;

            return (
              <Link key={index} href={link.url} target='_blank'>
                <Image
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
