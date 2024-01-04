'use client';

import Link from 'next/link';
import Image from 'next/image';

import { RxHamburgerMenu } from 'react-icons/rx';

import {
  useMainAppContext,
  useSetMobileNavbarOpen,
} from '../../contexts/AppProvider';
import Button from '../utils/Button';
import LanguageSwitcher from '../utils/LanguageSwitcher';
import { DONATE_URL } from '../../utils/paths';
import { useRouter } from 'next/navigation';
import { useTranslation } from '../../i18n/client';
import { Suspense } from 'react';
import { MenuSections } from './config';
import DropdownMenu from '../menu/DropdownMenu';
import MenuItem from '../menu/MenuItem';

const Navbar = () => {
  const { lng } = useMainAppContext();
  const { t } = useTranslation(lng, 'common');
  const router = useRouter();
  const setMobileMenuOpen = useSetMobileNavbarOpen();

  return (
    <>
      <div className='bg-bege-dark px-4 lg:px-14'>
        <div className='flex gap-3'>
          <div className='my-auto flex justify-center py-3'>
            <Link href='/' className='text-xl normal-case'>
              <div className='flex gap-1'>
                <Image
                  src='/images/logo.png'
                  alt='Hawk Stars Logo'
                  width={150}
                  height={100}
                  priority
                />
              </div>
            </Link>
          </div>
          {/* NAVBAR DESKTOP */}
          <div className='my-auto ml-auto hidden lg:block'>
            <div className='ml-auto flex gap-3'>
              <ul className='flex flex-row gap-8 px-1'>
                {MenuSections.map((section, index) => {
                  if (section.type === 'dropdown') {
                    const { title, options } = section;
                    return (
                      <li className='my-auto' key={index}>
                        <DropdownMenu title={title} options={options} />
                      </li>
                    );
                  } else {
                    const { option } = section;
                    return <MenuItem key={option.label} {...option} />;
                  }
                })}

                {/* <li className='my-auto'>
                  <Link
                    href={BE_MEMBER_FORM_URL}
                    target='_blank'
                    className='cursor-pointer'
                  >
                    <Suspense>{t('common.be_member')}</Suspense>
                  </Link>
                </li> */}
                <li>
                  <Button
                    type={'submit'}
                    onClick={() => {
                      router.push(DONATE_URL);
                    }}
                  >
                    <Suspense>{t('common.donate')}</Suspense>
                  </Button>
                </li>
              </ul>
              <div className='my-auto'>
                <LanguageSwitcher />
              </div>
            </div>
          </div>
          {/* NAVBAR MOBILE */}
          <div className='my-auto ml-auto block cursor-pointer lg:hidden'>
            <RxHamburgerMenu
              size={28}
              onClick={() => setMobileMenuOpen(true)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
