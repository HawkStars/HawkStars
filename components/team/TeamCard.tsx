'use client';
import { BoardMember } from '@/payload-types';
import { SocialIcon, SocialType } from '@/utils/models/social';
import Link from 'next/link';
import { ImageMedia } from '@/payload/components/Media';
import { LanguageProps } from '../types';
import { useTranslation } from '@/i18n/client';
import { getInitials } from '@/lib/initials';

type TeamCardProps = LanguageProps & {
  member: BoardMember;
};

const TeamCard = ({ member, lng }: TeamCardProps) => {
  const { t } = useTranslation(lng, 'team');
  const { name, photo, title, department, links } = member;
  const visibleLinks = links?.filter(
    (link) => link.isVisible && SocialIcon[link.platform as SocialType]
  );

  return (
    <div className='group flex flex-col gap-3'>
      {/* Every portrait gets the same 4:5 frame on a warm backdrop, cropped from the top so
          faces stay in frame, whatever the original photo's size or background. */}
      <div className='bg-bege-light relative aspect-4/5 overflow-hidden rounded-xl'>
        {photo ? (
          <ImageMedia
            resource={photo}
            alt={name}
            fill
            sizes='(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 20vw'
            className='object-cover object-top transition-transform duration-500 group-hover:scale-105'
          />
        ) : (
          <span
            aria-hidden='true'
            className='text-green font-display absolute inset-0 flex items-center justify-center text-4xl font-semibold'
          >
            {getInitials(name)}
          </span>
        )}
      </div>

      <div>
        <h3 className='text-body_semibold leading-snug'>{name}</h3>
        <p className='text-eyebrow text-green mt-1'>{t(`roles.${title}`)}</p>
        {department && <p className='mt-1 text-sm text-black/60'>{department}</p>}
      </div>

      {visibleLinks && visibleLinks.length > 0 && (
        <div className='flex flex-wrap gap-2'>
          {visibleLinks.map((link, index) => (
            <Link
              key={index}
              href={link.url}
              target='_blank'
              rel='noopener noreferrer'
              className='opacity-60 transition-opacity hover:opacity-100'
            >
              <ImageMedia
                src={SocialIcon[link.platform as SocialType] as string}
                alt={link.platform}
                width={22}
                height={22}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamCard;
