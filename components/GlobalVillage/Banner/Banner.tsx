import Image from 'next/image';

import { LanguageProps } from '@/components/types';
import { useServerTranslation } from '@/i18n';

import starPng from '@/public/images/icons/training_center/star.png';
import gridPng from '@/public/images/icons/training_center/grid.png';

const GlobalVillageBanner = async ({ lng }: LanguageProps) => {
  const { t } = await useServerTranslation(lng, 'training_center');
  return (
    <section className='mb-12 bg-green'>
      <div className='relative mx-auto max-w-6xl px-10 py-24 lg:px-40 lg:py-40'>
        <p className='text-justify text-white'>{t('banner')}</p>
        <Image
          src={starPng}
          alt='small star'
          className='absolute right-4 top-2 lg:right-20 lg:top-10 xl:right-10'
        />
        <Image
          src={gridPng}
          alt='small star'
          className='absolute bottom-4 left-4 lg:bottom-10 lg:left-20 xl:left-10'
        />
      </div>
    </section>
  );
};

export default GlobalVillageBanner;
