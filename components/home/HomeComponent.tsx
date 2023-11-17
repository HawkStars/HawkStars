'use client';
import Image from 'next/image';
import Button from '../utils/Button';

import config from './config.json';
import { BE_MEMBER_FORM_URL, DONATE_URL } from '../../utils/paths';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from '../../i18n/client';
import { Suspense } from 'react';

const HomeComponent = ({ lng }: { lng: string }) => {
  const { t } = useTranslation(lng, 'common');
  const router = useRouter();
  return (
    <>
      <section className='flex flex-col bg-bege-light px-8 pb-5 pt-10 lg:px-14 lg:pb-10 lg:pl-20 lg:pt-40'>
        <div className='flex flex-col gap-5 lg:flex-row lg:gap-1'>
          <div className='flex flex-col gap-2 lg:w-1/2'>
            <h4 className='text-4xl font-black'>{t('home.title')}</h4>
            <p className='text-justify'>{t('home.description')}</p>
            <div className='mt-8 flex gap-5'>
              <div className='w-fit'>
                <Button
                  type={'button'}
                  onClick={() => {
                    router.push(DONATE_URL);
                  }}
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
              src='/images/frontpage/hero.png'
              fill={true}
              style={{ objectFit: 'contain' }}
              alt='Main Image Index'
            />
          </div>
        </div>
      </section>
      <section>
        <div className='mt-5 flex flex-col gap-10 px-8 pb-10 lg:mt-20 lg:flex-row-reverse lg:px-14 lg:pl-20'>
          <div className='flex flex-col gap-2 lg:w-1/2'>
            <h4 className='text-2xl font-black text-green'>
              {t('home.about')}
            </h4>
            <h4 className='text-xl font-black'>{t('home.objetives_title')}</h4>
            <p className='text-justify'>{t('home.objetives_body')}</p>
          </div>
          <div className='relative h-96 w-full lg:w-1/2'>
            <Image
              src='/images/frontpage/quem_somos.png'
              alt='quem_somos'
              fill={true}
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>
      <section className='px-2 py-10'>
        <h4 className='flex justify-center text-2xl font-black text-green'>
          <Suspense fallback=''>{t('home.values_title')}</Suspense>
        </h4>
        <h6 className='flex justify-center text-center'>
          <Suspense fallback=''>{t('home.values_body')}</Suspense>
        </h6>
        <div className='mx-auto mt-10 grid w-2/3 grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-3'>
          {config.vision.map((option, index) => (
            <div key={index} className='flex flex-col items-center gap-2'>
              <div>
                <Image
                  src={option.icon}
                  alt={`${option.title} icon`}
                  width={32}
                  height={32}
                />
              </div>
              <h5 className='font-black text-green'>{t(option.title)}</h5>
              <h6 className='text-center'>{t(option.description)}</h6>
            </div>
          ))}
        </div>
      </section>
      <section className='h-96 bg-bege-dark py-10'></section>
    </>
  );
};
export default HomeComponent;
