'use client';

import { useMainAppContext, useSetMobileNavbarOpen } from '../../utils/contexts/AppProvider';
import Image from 'next/image';
import { RxCross1 } from 'react-icons/rx';

import Button from '../utils/Button';
import Socials from '../utils/Socials';
import LanguageSwitcher from '../utils/LanguageSwitcher';
import { useTranslation } from '../../i18n/client';
import MobileMenuItem from '../menu/MobileMenuItem';
import Link from 'next/link';
import { MenuSections } from './config';
import { useRouter } from 'next/navigation';
import { urls, transformUrl } from '@/utils/paths';

import { useLanguageCookie } from '@/utils/contexts/AppProvider';
// import { useLanguageCookie } from '@/hooks/useLanguageCookie';

import { hawkLogo } from '@/utils/models/images/logos';

const MobileNavbar = () => {
  const { mobileNavbarOpen } = useMainAppContext();
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'common');
  const setMobileMenuOpen = useSetMobileNavbarOpen();
  const router = useRouter();

  const goToUrl = (url: string) => {
    router.push(transformUrl(lng, url));
    setMobileMenuOpen(false);
  };

  return (
    <>
      {mobileNavbarOpen && (
        <div className='fixed z-900 flex h-screen w-full flex-col gap-4 bg-white px-4 py-3 lg:hidden'>
          <div className='flex py-1'>
            <Link href='/'>
              <Image src={hawkLogo} alt='Hawk Stars Logo' priority width={150} className='-mt-1' />
            </Link>
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
          <div className='mt-5 grid grid-cols-1 gap-4'>
            {MenuSections.map((section) => {
              if (section.type === 'dropdown') {
                const { title, options } = section;
                return (
                  <div key={title} className='flex flex-col gap-3'>
                    <MobileMenuItem title={title} options={options} />
                  </div>
                );
              }
            })}
          </div>

          <div className='flex flex-col'>
            {/* <Link
              href={BE_MEMBER_FORM_URL}
              target='_blank'
              className='mb-2 cursor-pointer  '
            >
              {t('common.be_member')}
            </Link> */}
            <Button
              type={'button'}
              variant='success'
              size='fit'
              onClick={() => goToUrl(urls.donate)}
            >
              {t('common.donate')}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNavbar;
