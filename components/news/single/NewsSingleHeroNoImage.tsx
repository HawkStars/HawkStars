import { HawkStarsSection } from '@/components/layout';
import { Language } from '@/i18n/settings';
import { News } from '@/payload-types';
import { FC } from 'react';

type NewsSingleHeroProps = Pick<News, 'title' | 'type' | 'publishedAt'> & {
  lng: Language;
};

const NewsSingleHeroNoImage: FC<NewsSingleHeroProps> = ({ title, type, publishedAt, lng }) => {
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString(lng, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <HawkStarsSection className='bg-green px-4 py-16 xl:px-40'>
      <div className='mx-auto max-w-4xl'>
        <span className='mb-4 inline-block rounded-sm border border-white/30 bg-white/10 px-3 py-1 text-xs font-bold tracking-widest text-white uppercase'>
          {type ? type.replace('_', ' ') : ''}
        </span>
        <h1 className='text-h1_semibold text-white'>{title}</h1>
        {formattedDate && <p className='mt-3 text-sm font-light text-white/70'>{formattedDate}</p>}
      </div>
    </HawkStarsSection>
  );
};

export default NewsSingleHeroNoImage;
