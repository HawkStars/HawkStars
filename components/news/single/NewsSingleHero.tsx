import { HawkStarsSection } from '@/components/layout';
import { Language } from '@/i18n/settings';
import { getImagePayloadUrl } from '@/lib/image';

import { ImageType, News } from '@/payload-types';
import Image from 'next/image';
import { FC } from 'react';

type NewsSingleHeroProps = Pick<News, 'title' | 'type' | 'publishedAt'> & {
  heroImage: ReturnType<typeof getImagePayloadUrl>;
  lng: Language;
};

const NewsSingleHero: FC<NewsSingleHeroProps> = ({ title, type, heroImage, publishedAt, lng }) => {
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString(lng, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  if (!heroImage) return null;

  return (
    <HawkStarsSection padding='none' className='relative h-105 overflow-hidden lg:h-140'>
      <Image
        src={heroImage.url || ''}
        alt={heroImage.alt || title}
        fill
        className='object-cover'
        priority
      />
      {/* Gradient overlay for readability */}
      <div className='absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent' />

      {/* Title overlay on hero */}
      <div className='absolute inset-x-0 bottom-0 px-4 pb-10 xl:px-40'>
        <div className='mx-auto max-w-4xl'>
          <span className='bg-green mb-4 inline-block rounded-sm px-3 py-1 text-xs font-bold tracking-widest text-white uppercase'>
            {type.replace('_', ' ')}
          </span>
          <h1 className='text-h1_semibold text-white drop-shadow-lg'>{title}</h1>
          {formattedDate && (
            <p className='mt-3 text-sm font-light text-white/70'>{formattedDate}</p>
          )}
        </div>
      </div>
    </HawkStarsSection>
  );
};

export default NewsSingleHero;
