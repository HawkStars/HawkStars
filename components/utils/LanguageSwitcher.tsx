'use client';
import { PT, GB } from 'country-flag-icons/react/3x2';
import classNames from 'classnames';
// import { useLanguageCookie } from '@/hooks/useLanguageCookie';

import { useRouter } from 'next/navigation';
import { useLanguageCookie, useSetLanguageCookie } from '@/utils/contexts/AppProvider';
import { Language } from '@/i18n/settings';

const LanguageSwitcher = () => {
  const router = useRouter();
  const lng = useLanguageCookie();
  const setLng = useSetLanguageCookie();

  const changeLanguage = (newLng: Language) => {
    setLng(newLng);
    const urlValues = window.location.pathname
      .split('/')
      .filter((item) => item != '')
      .splice(1);

    const newPath = `/${newLng}/${urlValues.join('/')}`;
    // router.push(newPath);
  };

  return (
    <>
      <div className='relative flex cursor-pointer flex-row gap-2 px-3'>
        <div className='flex h-4 w-6' onClick={() => changeLanguage('pt')}>
          <PT title='PT' className={classNames({ grayscale: lng != 'pt' })} />
        </div>
        <div className='flex h-4 w-6' onClick={() => changeLanguage('en')}>
          <GB title='EN' className={classNames({ grayscale: lng != 'en' })} />
        </div>
      </div>
    </>
  );
};

export default LanguageSwitcher;
