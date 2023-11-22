import * as React from 'react';
import Image from 'next/image';
import { useTranslation } from '@/i18n';

const GlobalVillageProject = async ({ lng }: { lng: string }) => {
  const { t } = await useTranslation(lng, 'training_center');
  return (
    <section className='lg:bg-gradient-to-r lg:from-bege-light lg:via-bege-dark lg:to-white'>
      <div className='flex max-w-6xl flex-col-reverse items-center md:mx-auto md:flex-row md:py-24'>
        <div className='flex flex-col-reverse items-stretch px-10 max-md:ml-0 max-sm:pb-10 md:w-[48%] lg:px-0'>
          <div className='my-auto flex w-full flex-col items-stretch max-md:mt-10 max-md:max-w-full lg:gap-10'>
            <div className='text-5xl font-semibold leading-[49.44px] text-black max-md:max-w-full max-md:text-4xl'>
              {t('project.title')}
            </div>
            <div className='mt-4 text-2xl font-light leading-7 text-black max-md:max-w-full'>
              {t('project.presentation')}
            </div>
          </div>
        </div>
        <div className='ml-5 flex w-[52%] flex-col items-stretch max-md:ml-0 max-md:w-full'>
          <Image
            loading='lazy'
            src='/images/hero.png'
            className='aspect-[1.2] w-full overflow-hidden object-contain object-center max-sm:max-w-full lg:mt-10'
            alt='hero'
            width='400'
            height='400'
          />
        </div>
      </div>
    </section>
  );
};

export default GlobalVillageProject;
