import HawkLabel from '@/components/common/hawk-label';
import { HawkStarsSection } from '@/components/layout';
import { Language, toIntlLocale } from '@/i18n/settings';
import { getImagePayloadUrl } from '@/lib/image';
import { cn } from '@/lib/utils';

import { News } from '@/payload-types';
import { ImageMedia } from '@/payload/components/Media';
import { FC } from 'react';

type NewsSingleHeroProps = Pick<News, 'title' | 'type' | 'publishedAt'> & {
  heroImage: ReturnType<typeof getImagePayloadUrl>;
  lng: Language;
};

const NewsSingleHero: FC<NewsSingleHeroProps> = ({ title, type, heroImage, publishedAt, lng }) => {
  // `lng` ('pt'/'en') isn't guaranteed a valid Intl locale tag on its own —
  // must resolve through toIntlLocale, or an unsupported value throws
  // `RangeError: Incorrect locale information provided`. See i18n/settings.ts.
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString(toIntlLocale(lng), {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  if (!heroImage) return null;

  return (
    <HawkStarsSection
      padding='none'
      className='bg-green lg:min-h-50vh justify-around'
      spacing='loose'
    >
      <div className='flex w-full justify-center gap-1 max-lg:mx-3 max-lg:flex-col lg:gap-4 xl:max-w-6xl'>
        <div className='flex flex-col justify-around gap-2 lg:max-w-1/2 lg:pl-4'>
          <HawkLabel type={type} className='mb-15' />
          <h1
            className={cn('text-h1_semibold text-white', {
              'mt-auto': !formattedDate,
            })}
          >
            {title}
          </h1>
          {formattedDate && (
            <p className='mt-3 mb-auto text-sm font-light text-white/85'>{formattedDate}</p>
          )}
        </div>

        <ImageMedia
          src={heroImage.url}
          alt={heroImage.alt}
          className='object-cover lg:object-contain'
          preload
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw'
          pictureClassName='relative w-full max-lg:mt-4 max-lg:aspect-[16/10] lg:flex-1 min-h-[50vw] lg:min-h-[50vh]'
        />
      </div>
    </HawkStarsSection>
  );
};

export default NewsSingleHero;
