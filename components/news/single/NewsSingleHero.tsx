import HawkLabel from '@/components/common/hawk-label';
import { HawkStarsSection } from '@/components/layout';
import { Language } from '@/i18n/settings';
import { getImagePayloadUrl } from '@/lib/image';

import { News } from '@/payload-types';
import { ImageMedia } from '@/payload/components/Media';
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
      <div className='mx-auto flex gap-1 max-lg:mx-3 max-lg:flex-col lg:gap-4 xl:max-w-6xl'>
        <div className='flex flex-col gap-2 lg:max-w-1/2'>
          <HawkLabel type={type} />
          <h1 className='text-h1_semibold text-white'>{title}</h1>
          {formattedDate && (
            <p className='mt-3 text-sm font-light text-white/70'>{formattedDate}</p>
          )}
        </div>

        <ImageMedia
          src={heroImage.url}
          alt={heroImage.alt}
          className='object-cover lg:object-contain'
          preload
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw'
          pictureClassName='relative w-full max-lg:mt-4 max-lg:aspect-[16/10] lg:flex-1'
        />
      </div>
    </HawkStarsSection>
  );
};

export default NewsSingleHero;
