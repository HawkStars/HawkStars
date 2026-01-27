'use client';

import Image from 'next/image';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { urls, transformUrl } from '@/utils/paths';

import {
  useLanguageCookie,
  useMainAppContext,
  useSetMobileNavbarOpen,
} from '@/utils/contexts/AppProvider';

import { hawkLogo } from '@/utils/models/images/logos';
import Socials from '@/components/utils/Socials';
import { useTranslation } from '@/i18n/client';
import { Button } from '@/components/ui/button';
import MobileMenuItem from './MobileMenuItem';

const MobileNavbar = () => {
  const { mobileNavbarOpen, headerInfo } = useMainAppContext();
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'common');
  const setMobileMenuOpen = useSetMobileNavbarOpen();
  const router = useRouter();

  const goToUrl = (url: string) => {
    router.push(transformUrl(lng, url));
    setMobileMenuOpen(false);
  };

  if (!mobileNavbarOpen) return null;

  return (
    <div className='fixed z-900 flex h-screen w-full flex-col gap-4 bg-white px-4 py-3 lg:hidden'>
      <div className='flex py-1'>
        <Link href='/'>
          <Image src={hawkLogo} alt='Hawk Stars Logo' priority width={150} className='-mt-1' />
        </Link>
        <div
          className='cross-x relative my-auto ml-auto block h-5 w-5 cursor-pointer lg:hidden'
          onClick={() => setMobileMenuOpen(false)}
        />
      </div>

      <div className='mt-5 grid grid-cols-1 gap-4'>
        {headerInfo?.columns.map((column, index) => {
          return <MobileMenuItem data={column} key={`${column.id}-${index}`} />;
        })}
      </div>

      <div className='flex w-fit flex-col'>
        <Button type={'button'} variant='default' size='lg' onClick={() => goToUrl(urls.donate)}>
          {t('common.donate')}
        </Button>
      </div>
      <div className='mt-auto mb-5 ml-auto'>
        <Socials />
      </div>
    </div>
  );
};

export default MobileNavbar;
