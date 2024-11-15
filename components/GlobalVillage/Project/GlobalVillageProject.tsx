import * as React from 'react';
import Image from 'next/image';
import { getServerTranslation } from '@/i18n';
import DonateLink from '../DonateLink/DonateLink';

const GlobalVillageProject = async ({ lng }: { lng: string }) => {
  const { t } = await getServerTranslation(lng, 'training_center');
  return (
    <section className='lg:bg-gradient-to-r lg:from-bege-light lg:via-bege-dark lg:to-white'>
      <div className='flex max-w-6xl flex-col-reverse items-center md:mx-auto lg:flex-row lg:px-4 lg:py-24'>
        <div className='flex flex-col-reverse items-stretch px-10 py-10 max-md:ml-0 max-sm:py-10 lg:w-[48%] lg:px-0'>
          <div className='my-auto flex w-full flex-col items-stretch max-md:my-10 max-md:max-w-full lg:gap-10'>
            <h1 className='text-black text-5xl font-semibold leading-[49.44px] max-md:max-w-full max-md:text-4xl'>
              {t('project.title')}
            </h1>
            <p className='text-black mt-4 text-2xl font-light leading-7 max-md:max-w-full lg:text-justify'>
              {t('project.presentation')}
            </p>
            <div className='mt-5 lg:mt-0'>
              <DonateLink />
            </div>
          </div>
        </div>
        <div className='flex w-[52%] flex-col items-stretch max-lg:w-full max-md:ml-0 lg:ml-5'>
          <Image
            loading='lazy'
            src='/images/hero.png'
            className='aspect-[1.2] w-full overflow-hidden object-contain object-center max-sm:max-w-full sm:pr-0 lg:mt-10 lg:pr-0'
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
