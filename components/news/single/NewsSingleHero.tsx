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
    <HawkStarsSection padding='none' className='bg-green' spacing='loose'>
      <div className='mx-auto flex max-w-5xl gap-1 max-lg:mx-3 max-lg:flex-col'>
        <div className='flex flex-col gap-2'>
          <HawkLabel type={type} />
          <h1 className='text-h1_semibold text-white drop-shadow-lg'>{title}</h1>
          {formattedDate && (
            <p className='mt-3 text-sm font-light text-white/70'>{formattedDate}</p>
          )}
        </div>

        <div className='relative w-full max-w-1/3 max-lg:mx-4'>
          <Image
            src={heroImage.url}
            alt={heroImage.alt}
            fill
            className='absolute mx-auto'
            priority
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        </div>
      </div>
    </HawkStarsSection>
  );
};

export default NewsSingleHero;
