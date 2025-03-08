'use client';

import Button from '@/components/utils/Button';
import { urls, BE_MEMBER_FORM_URL } from '@/utils/paths';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

import heroPng from '@/public/images/frontpage/hero.png';

const HomeHeroSection = () => {
  const router = useRouter();
  const { t } = useTranslation('common');

  return (
    <section className='flex flex-col bg-bege-light px-8 pb-5 pt-10 lg:px-14 lg:pb-10 lg:pl-20 lg:pt-40'>
      <div className='mx-auto flex max-w-6xl flex-col gap-5 lg:flex-row lg:gap-1'>
        <div className='flex flex-col gap-2 lg:w-1/2'>
          <h1 className='lg:text-h1_semibold text-h2_bold'>{t('home.title')}</h1>
          <p className='text-h2_light lg:text-justify'>{t('home.description')}</p>
          <div className='mt-8 flex gap-5'>
            <div className='w-fit'>
              <Button
                type={'button'}
                onClick={() => {
                  router.push(urls.donate);
                }}
                className='h-full'
              >
                <Suspense fallback=''>{t('common.donate')}</Suspense>
              </Button>
            </div>
            <div className='w-fit'>
              <Link href={BE_MEMBER_FORM_URL} target='_blank'>
                <Button outline={true} type={'button'}>
                  <Suspense fallback=''>{t('common.be_member')}</Suspense>
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className='relative mt-2 h-96 w-full py-20 lg:mt-0 lg:w-1/2 lg:py-0'>
          <Image
            src={heroPng}
            fill={true}
            style={{ objectFit: 'contain' }}
            alt='Main Image Index'
            loading='lazy'
            sizes='100vw lg:50vw'
          />
        </div>
      </div>
    </section>
  );
};

export default HomeHeroSection;
