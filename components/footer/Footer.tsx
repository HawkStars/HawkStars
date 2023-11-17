'use client';
import React, { Suspense } from 'react';
import Socials from '../utils/Socials';
import Image from 'next/image';
import Link from 'next/link';

import { MenuSections } from './config';
import Button from '../utils/Button';
import {
  BE_MEMBER_FORM_URL,
  DONATE_URL,
  HOME_URL,
  transformUrl,
} from '../../utils/paths';
import classNames from 'classnames';
import LanguageSwitcher from '../utils/LanguageSwitcher';
import { useRouter } from 'next/navigation';
import { useTranslation } from '../../i18n/client';
import { useMainAppContext } from '@/contexts/AppProvider';

const Footer = () => {
  return (
    <footer>
      <div className='mt-4 block px-5 lg:hidden'>
        <div className='flex flex-col gap-5'>
          <Image
            src='/images/logo.png'
            alt='hawkstars'
            height='200'
            width='200'
          ></Image>
          <div className='-ml-3'>
            <LanguageSwitcher />
          </div>
          <div>
            <Socials />
          </div>
        </div>
        <div className='mt-10 grid grid-cols-2 gap-10'>
          <Menus />
        </div>
      </div>
      <div className='hidden grid-cols-1 gap-1 px-12 py-4 lg:grid lg:grid-cols-5 lg:gap-7 lg:pt-20'>
        <div className='mb-auto lg:mx-auto'>
          <Image
            src='/images/logo.png'
            alt='hawkstars'
            height='200'
            width='200'
          ></Image>
        </div>
        <Menus />
      </div>
      <div className='mt-10 flex flex-col px-5 pb-10 lg:mt-0 lg:flex-row lg:gap-1 lg:border-t lg:px-10 lg:pt-1'>
        <p className='text-sm'>
          Designed by{' '}
          <Link
            href={'http://rodrigorossellini.com/'}
            className='underline'
            target='_blank'
          >
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

const Menus = () => {
  const { lng } = useMainAppContext();
  const { t } = useTranslation(lng, 'common');
  const router = useRouter();

  return (
    <>
      {MenuSections.map((section, index) => {
        const { title, options } = section;
        return (
          <div
            key={index}
            className='text-terciary-100 ml-0 text-left lg:text-left'
          >
            <h3 className='mb-1 text-base font-semibold lg:mb-3 lg:text-lg lg:font-bold'>
              <Suspense fallback={title}>{t(title)}</Suspense>
            </h3>
            {options.map((option, index) => (
              <div className='py-1' key={index}>
                <Link
                  href={transformUrl(lng, option.url || HOME_URL)}
                  className={classNames({
                    'text-disabled': option.disabled,
                  })}
                >
                  <Suspense fallback={option.label}>{t(option.label)}</Suspense>
                </Link>
              </div>
            ))}
          </div>
        );
      })}

      <div className='flex flex-col'>
        <Link
          href={BE_MEMBER_FORM_URL}
          target='_blank'
          className='mb-2 text-lg font-black'
        >
          <Suspense>{t('common.be_member')}</Suspense>
        </Link>
        <Button
          type={'button'}
          variant='success'
          onClick={() => {
            router.push(DONATE_URL);
          }}
        >
          <Suspense>{t('common.donate')}</Suspense>
        </Button>
      </div>
    </>
  );
};

export default Footer;
