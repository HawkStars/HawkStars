import * as React from 'react';
import Image from 'next/image';
import { getServerTranslation } from '@/i18n';
import DonateLink from '../DonateLink/DonateLink';
import { Language } from '@/i18n/settings';

const GlobalVillageProject = async ({ lng }: { lng: Language }) => {
  const { t } = await getServerTranslation(lng, 'training_center');
  return (
    <section className='lg:bg-linear-to-r lg:from-bege-light lg:via-bege-dark lg:to-white'>
      <div className='flex max-w-6xl flex-col-reverse items-center md:mx-auto lg:flex-row lg:gap-10 lg:px-4 lg:py-24'>
        <div className='flex flex-col-reverse items-stretch px-3 py-5 max-md:ml-0 max-sm:py-10 lg:w-[48%] lg:px-0'>
          <div className='my-auto flex w-full flex-col items-stretch max-md:mb-10 max-md:max-w-full lg:gap-10'>
            <h1 className='lg:text-h1_semibold text-h2_bold max-md:max-w-full'>
              {t('project.title')}
            </h1>
            <p className='lg:text-h2_light text-body_regular mt-4 max-md:max-w-full'>
              {t('project.presentation')}
            </p>
            <div className='mt-6 lg:mt-0'>
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
