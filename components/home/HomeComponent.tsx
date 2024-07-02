'use client';
import Image from 'next/image';
import Button from '../utils/Button';

import { VisionType, visionIcons } from './config';
import { BE_MEMBER_FORM_URL, urls } from '../../utils/paths';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from '../../i18n/client';
import { Suspense } from 'react';

// Images
import exterior1 from '@/public/images/training_center/exterior1.jpg';
import heroPng from '@/public/images/frontpage/hero.png';
import whoWeAreImage from '@/public/images/frontpage/quem_somos.png';
import { LanguageProps } from '../types';
import { Slider } from '../utils/Slider';
import { SwiperSlide } from 'swiper/react';

const photos = Array.from({ length: 25 }, (_, i) => `/images/projects/${i + 1}.jpeg`);

const HomeComponent = ({ lng }: LanguageProps) => {
  const { t } = useTranslation(lng, 'common');
  const router = useRouter();

  return (
    <>
      <section className='flex flex-col bg-bege-light px-8 pb-5 pt-10 lg:px-14 lg:pb-10 lg:pl-20 lg:pt-40'>
        <div className='mx-auto flex max-w-6xl flex-col gap-5 lg:flex-row lg:gap-1'>
          <div className='flex flex-col gap-2 lg:w-1/2'>
            <h1 className='font-black lg:text-4xl'>{t('home.title')}</h1>
            <p className='lg:text-justify'>{t('home.description')}</p>
            <div className='mt-8 flex gap-5'>
              <div className='w-fit'>
                <Button
                  type={'button'}
                  onClick={() => {
                    router.push(urls.donate);
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
      <section className='mx-auto mt-5 flex max-w-6xl flex-col gap-10 px-8 pb-10 lg:mt-20 lg:flex-row-reverse lg:px-14 lg:pl-20 xl:pl-0'>
        <div className='flex flex-col gap-2 lg:w-1/2'>
          <h2 className='font-black text-green lg:text-2xl'>{t('home.about')}</h2>
          <h4 className='text-xl font-black'>{t('home.objetives_title')}</h4>
          <p className='lg:text-justify'>{t('home.objetives_body')}</p>
        </div>
        <div className='relative h-96 w-full lg:w-1/2'>
          <Image
            src={whoWeAreImage}
            alt='quem_somos'
            fill={true}
            style={{ objectFit: 'cover' }}
            loading='lazy'
            sizes='100vw lg:50vw'
          />
        </div>
      </section>
      <section className='px-2 py-10'>
        <h4 className='flex justify-center text-2xl font-black text-green'>
          {t('home.values_title')}
        </h4>
        <p className='flex justify-center text-center'>{t('home.values_body')}</p>
        <div className='mx-auto mt-10 grid w-2/3 grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-3'>
          {visionIcons.map((option: VisionType, index: number) => (
            <div key={index} className='flex flex-col items-center gap-2'>
              <div>
                <Suspense fallback={<p>loading...</p>}>
                  <Image
                    src={option.icon}
                    alt={`${option.title} icon`}
                    width={32}
                    height={32}
                    sizes='32px'
                  />
                </Suspense>
              </div>
              <h5 className='font-black text-green'>{t(option.title)}</h5>
              <p className='text-center'>{t(option.description)}</p>
            </div>
          ))}
        </div>
      </section>
      <section className='bg-bege-dark px-8 py-20 lg:px-20'>
        <div className='mx-auto flex max-w-6xl flex-col gap-5 lg:flex-row lg:gap-20'>
          <Image
            src={exterior1}
            alt='Global Village'
            className='flex-1 rounded-lg lg:w-1/2'
            sizes='100vw lg:50vw'
          />
          <div className='flex flex-1 flex-col gap-4 lg:w-1/2'>
            <h3 className='mt-5 font-black text-green'>Global Village</h3>
            <p>{t('home.global_village')}</p>
            <div>
              <Button type={'button'} onClick={() => router.push(urls.global_village)}>
                {t('see_more')}
              </Button>
            </div>
          </div>
        </div>
      </section>
      <section className='flex flex-col gap-6 py-20'>
        <h6 className='text-center text-2xl font-bold text-green'>Erasmus +</h6>
        <Slider
          loop={true}
          autoplay
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        >
          {photos.map((item, index) => (
            <SwiperSlide key={index}>
              <Image
                src={item}
                alt={index.toString()}
                fill
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                style={{ objectFit: 'fill', width: '100%', height: '100%' }}
              />
            </SwiperSlide>
          ))}
        </Slider>
      </section>
    </>
  );
};
export default HomeComponent;
