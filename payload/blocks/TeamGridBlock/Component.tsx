import React from 'react';
import Image from 'next/image';
import LinkedinIcon from '@/public/images/icons/socials/linkedin.svg';
import TwitterIcon from '@/public/images/icons/socials/twitter.svg';

import { Mail } from 'lucide-react';
import type { TeamGridBlock as TeamGridBlockProps } from '@/payload-types';
import { cn } from '@/lib/utils';
import { getImagePayloadUrl } from '@/lib/image';

export const TeamGridBlock: React.FC<TeamGridBlockProps> = ({
  title,
  subtitle,
  members = [],
  layout = 'cols-3',
  sectionId,
}) => {
  const gridClasses = {
    'cols-2': 'md:grid-cols-2',
    'cols-3': 'md:grid-cols-2 lg:grid-cols-3',
    'cols-4': 'md:grid-cols-2 lg:grid-cols-4',
  };

  if (!members || members.length === 0) return null;

  return (
    <section className='py-12 lg:py-20' id={sectionId || ''}>
      <div className='container mx-auto'>
        {(title || subtitle) && (
          <div className='mb-12 text-center'>
            {title && <h2 className='mb-4 text-3xl font-bold lg:text-4xl'>{title}</h2>}
            {subtitle && <p className='mx-auto max-w-2xl text-lg text-gray-600'>{subtitle}</p>}
          </div>
        )}

        <div
          className={cn('grid grid-cols-1 gap-8', gridClasses[layout as keyof typeof gridClasses])}
        >
          {members.map((member, index) => (
            <div key={index} className='group text-center'>
              {/* Photo */}
              {member.photo && (
                <div className='relative mx-auto mb-4 h-48 w-48 overflow-hidden rounded-full'>
                  <Image
                    src={getImagePayloadUrl(member.photo)?.url || ''}
                    alt={member.name}
                    fill
                    className='object-cover transition-transform duration-300 group-hover:scale-110'
                  />
                </div>
              )}

              {/* Info */}
              <h3 className='mb-1 text-xl font-semibold'>{member.name}</h3>
              <div className='mb-3 text-green-600'>{member.role}</div>

              {member.bio && <p className='mb-4 text-sm text-gray-600'>{member.bio}</p>}

              {/* Social Links */}
              <div className='flex justify-center gap-3'>
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className='rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-green-600 hover:text-white'
                  >
                    <Mail className='h-4 w-4' />
                  </a>
                )}
                {member.linkedIn && (
                  <a
                    href={member.linkedIn}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-green-600 hover:text-white'
                  >
                    <LinkedinIcon className='h-4 w-4' />
                  </a>
                )}
                {member.twitter && (
                  <a
                    href={member.twitter}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-green-600 hover:text-white'
                  >
                    <TwitterIcon className='h-4 w-4' />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
