import { BoardMember, Media } from '@/payload-types';
import { Card } from '../ui/card';
import { SocialIcon, SocialType } from '@/utils/models/social';
import Link from 'next/link';
import Image from 'next/image';

type TeamCardProps = {
  member: BoardMember;
};

const TeamCard = ({ member }: TeamCardProps) => {
  const links = member.links;
  return (
    <Card
      key={member.id}
      className='text-card-foreground bg-card/50 border-border/50 flex flex-col gap-6 rounded-xl border p-6 shadow-sm backdrop-blur-sm'
    >
      <div className='grid grid-cols-2 items-start gap-4'>
        {/* Content */}
        <div className='flex flex-col justify-between gap-6'>
          <div>
            <h3 className='text-foreground font-medium'>{member.name}</h3>
            <p className='text-muted-foreground text-xs'>{member.title}</p>
          </div>

          <div className='flex flex-wrap gap-2'>
            {/* Social Media Buttons */}
            {links?.map((link, index) => {
              if (!link.isVisible) return null;

              const icon = link && SocialIcon[link.platform as SocialType];
              if (!icon) return null;

              return (
                <Link
                  key={index}
                  href={link.url}
                  target='_blank'
                  className='hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 bg-background/50 border-border/50 flex h-8 w-8 justify-center gap-1.5 rounded-md border p-0 shadow-xs transition-all duration-200 has-[>svg]:px-2.5'
                >
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
        </div>

        {/* Avatar */}
        {member.photo && (
          <div>
            <Image
              width={128}
              height={128}
              src={(member.photo as Media).url as string}
              alt={member.name}
              className='h-full w-full rounded-lg object-contain'
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default TeamCard;
