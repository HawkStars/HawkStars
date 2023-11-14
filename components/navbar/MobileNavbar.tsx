'use client';

import {
  useMainAppContext,
  useSetMobileNavbarOpen,
} from '../../contexts/AppProvider';
import Image from 'next/image';
import Link from 'next/link';
import { RxCross1 } from 'react-icons/rx';

import Button from '../utils/Button';
import Socials from '../utils/Socials';
import LanguageSwitcher from '../utils/LanguageSwitcher';
import { BE_MEMBER_FORM_URL } from '../../app/paths';
import { useTranslation } from '../../i18n/client';
import MobileMenuItem from '../menu/MobileMenuItem';
import { NGODropdownOptions } from './config';

const MobileNavbar = () => {
  const { lng, mobileNavbarOpen } = useMainAppContext();
  const { t } = useTranslation(lng, 'common');
  const setMobileMenuOpen = useSetMobileNavbarOpen();

  return (
    <>
      {mobileNavbarOpen && (
        <div className='fixed z-900 flex h-screen w-full flex-col gap-4 bg-white px-4 py-3 lg:hidden'>
          <div className='flex'>
            <Image
              src='/logo.png'
              alt='Hawk Stars Logo'
              width={150}
              height={100}
              priority
            />
            <div className='my-auto ml-auto block cursor-pointer lg:hidden'>
              <RxCross1 size={28} onClick={() => setMobileMenuOpen(false)} />
            </div>
          </div>
          <div className='-ml-3'>
            <LanguageSwitcher />
          </div>
          <div>
            <Socials />
          </div>
          <div className='mt-5 flex flex-col gap-3'>
            <MobileMenuItem title={'navbar.ngo'} options={NGODropdownOptions} />
          </div>

          <div className='flex flex-col'>
            <Link
              href={BE_MEMBER_FORM_URL}
              target='_blank'
              className='mb-2 cursor-pointer text-lg font-black'
            >
              {t('common.be_member')}
            </Link>
            <Button type={'button'} variant='success' size='fit'>
              {t('common.donate')}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNavbar;
