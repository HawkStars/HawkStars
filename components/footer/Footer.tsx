'use client';
import React, { Suspense, lazy } from 'react';
import Socials from '../utils/Socials';
import Image from 'next/image';
import Link from 'next/link';

import { hawkLogo } from '@/utils/models/images/logos';
import dynamic from 'next/dynamic';
import { urls } from '@/utils/paths';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';

const LanguageSwitcher = dynamic(() => import('../utils/LanguageSwitcher'), { ssr: false });
const FooterMenu = lazy(() => import('./FooterMenu'));

const Footer = () => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'common');

  return (
    <footer>
      <div className='mt-4 block px-5 lg:hidden'>
        <div className='flex max-w-40 flex-col gap-5'>
          <Image src={hawkLogo} alt='hawkstars' sizes='100px' style={{ objectFit: 'cover' }} />
          <div className='-ml-3'>
            <LanguageSwitcher />
          </div>
          <div>
            <Socials />
          </div>
        </div>
        <div className='mt-10 grid grid-cols-2 gap-10 max-sm:grid-cols-1'>
          <FooterMenu />
        </div>
        <div className='mt-4 underline lg:hidden'>
          <Link href={urls.terms}>{t('navbar.art_gallery.terms_and_conditions')}</Link>
        </div>
      </div>
      <div className='hidden grid-cols-1 gap-1 px-12 py-4 lg:grid lg:grid-cols-5 lg:gap-7 lg:pt-20'>
        <div className='mb-auto max-w-52 lg:mx-auto'>
          <Image src={hawkLogo} alt='hawkstars' height='200' width='200' />
        </div>
        <Suspense>
          <FooterMenu />
        </Suspense>
      </div>

      <div className='mt-10 flex flex-col px-5 pb-10 lg:mt-0 lg:flex-row lg:gap-1 lg:border-t lg:px-10 lg:pt-1'>
        <p className=''>
          Designed by{' '}
          <Link href={'https://dribbble.com/Rossellini'} className='underline' target='_blank'>
            @Rodrigo Rosselini
          </Link>
          .
        </p>
        <p className=''>
          {' '}
          Built by{' '}
          <Link
            href={'https://www.linkedin.com/in/pcardosolei/'}
            className='underline'
            target='_blank'
          >
            @Paulo Cardoso
          </Link>
        </p>
        <div className='ml-auto gap-5 lg:flex'>
          <Link href={urls.terms} className='max-lg:hidden'>
            {t('navbar.art_gallery.terms_and_conditions')}
          </Link>
          <div className='hidden lg:block' data-testid='socials-footer'>
            <Socials />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
