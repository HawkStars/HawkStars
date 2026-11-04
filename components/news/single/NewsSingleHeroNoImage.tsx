import HawkLabel from '@/components/common/hawk-label';
import { HawkStarsSection } from '@/components/layout';
import { Language } from '@/i18n/settings';
import { News } from '@/payload-types';
import { FC } from 'react';
import { formatDate } from '@/utils/date';

type NewsSingleHeroProps = Pick<News, 'title' | 'type' | 'publishedAt'> & {
  lng: Language;
};

const NewsSingleHeroNoImage: FC<NewsSingleHeroProps> = ({ title, type, publishedAt, lng }) => {
  const formattedDate = formatDate(publishedAt, lng) || null;

  return (
    <HawkStarsSection spacing='tight' className='bg-green'>
      <div>
        <HawkLabel type={type} className='mb-15' design='badge' />
        <h1 className='text-display text-white'>{title}</h1>
        {formattedDate && <p className='mt-3 text-sm font-light text-white/95'>{formattedDate}</p>}
      </div>
    </HawkStarsSection>
  );
};

export default NewsSingleHeroNoImage;
