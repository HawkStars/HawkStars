'use client';
import React, { Suspense } from 'react';
import Socials from '../utils/Socials';
import Image from 'next/image';
import Link from 'next/link';

import hawkLogo from '@/public/images/logo.png';
import dynamic from 'next/dynamic';

const LanguageSwitcher = dynamic(() => import('../utils/LanguageSwitcher'), { ssr: false });
const FooterMenu = dynamic(() => import('./FooterMenu'), { ssr: false });

const Footer = () => {
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
        <div className='mt-10 grid grid-cols-2 gap-10'>
          <FooterMenu />
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
        <p className='text-sm'>
          Designed by{' '}
          <Link href={'http://rodrigorossellini.com/'} className='underline' target='_blank'>
            @Rodrigo Rosselini
          </Link>
          .
        </p>
        <p className='text-sm'>
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
        <div className='ml-auto hidden lg:block'>
          <Socials />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
