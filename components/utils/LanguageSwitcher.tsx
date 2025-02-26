'use client';
import { PT, GB } from 'country-flag-icons/react/3x2';
import { useState } from 'react';

import { PiCaretDownThin } from 'react-icons/pi';
import classNames from 'classnames';
// import { useLanguageCookie } from '@/hooks/useLanguageCookie';

import { useRouter } from 'next/navigation';
import { useLanguageCookie, useSetLanguageCookie } from '@/utils/contexts/AppProvider';
import { Language } from '@/i18n/settings';

const LanguageSwitcher = () => {
  const router = useRouter();
  const lng = useLanguageCookie();
  const setLng = useSetLanguageCookie();
  const [showLanguageOptions, setShowLanguageOptions] = useState<boolean>(false);

  const changeLanguage = (newLng: Language) => {
    setLng(newLng);
    router.push(`/${newLng}`);
  };

  return (
    <>
      <div
        className='relative flex cursor-pointer flex-row gap-2 px-3'
        onClick={() => setShowLanguageOptions((currentStatus) => !currentStatus)}
      >
        {lng === 'pt' ? (
          <>
            <div className='flex h-4 w-6'>
              <PT title='PT' />
            </div>
            <div className='my-auto'>PT</div>
          </>
        ) : (
          <>
            <div className='flex h-4 w-6'>
              <GB title='EN' />
            </div>
            <div className='my-auto'>EN</div>
          </>
        )}
        <PiCaretDownThin />
      </div>
      {showLanguageOptions && (
        <div className='z-100 absolute mt-2 flex w-fit cursor-pointer flex-col gap-2 bg-bege-light py-1 pl-3 pr-5'>
          {lng !== 'en' && (
            <div
              className='flew-row flex cursor-pointer gap-2'
              onClick={() => changeLanguage('en')}
            >
              <div className='flex h-4 w-6'>
                <GB title='EN' />
              </div>
              <label className={classNames('text-black my-auto')}>EN</label>
            </div>
          )}
          {lng !== 'pt' && (
            <div
              className='flew-row flex cursor-pointer gap-2'
              onClick={() => changeLanguage('pt')}
            >
              <div className='flex h-4 w-6'>
                <PT title='PT' />
              </div>
              <label className={classNames('text-black my-auto')}>PT</label>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default LanguageSwitcher;
