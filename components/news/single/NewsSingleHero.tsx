import HawkLabel from '@/components/common/hawk-label';
import { HawkStarsSection } from '@/components/layout';
import { Language } from '@/i18n/settings';
import { getImagePayloadUrl } from '@/lib/image';

import { News } from '@/payload-types';
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
    <HawkStarsSection padding='none'>
      {/* Title overlay on hero */}
      <div className='bg-green flex px-4 pt-10 pb-10 xl:px-40'>
        <div className='mx-auto max-w-4xl'>
          <HawkLabel type={type} />
          <h1 className='text-h1_semibold text-white drop-shadow-lg'>{title}</h1>
          {formattedDate && (
            <p className='mt-3 text-sm font-light text-white/70'>{formattedDate}</p>
          )}
        </div>

        <div className='relative mt-5 h-48 w-auto max-w-4xl flex-1 max-lg:mx-4'>
          <Image
            src={heroImage.url || ''}
            alt={heroImage.alt || ''}
            fill
            className='absolute mx-auto object-contain'
            priority
          />
        </div>
      </div>
    </HawkStarsSection>
  );
};

export default NewsSingleHero;
