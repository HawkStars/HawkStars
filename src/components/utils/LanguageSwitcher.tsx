'use client';
import { PT, GB } from 'country-flag-icons/react/3x2';
import { useState } from 'react';

import { PiCaretDownThin } from 'react-icons/pi';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';

import Link from 'next/link';
import { transformUrl } from '@/paths';
import i18next from 'i18next';

type LanguageSwitcherProps = {
  closeMobileTabHandler?: () => void;
  lng: string;
};

const LanguageSwitcher = ({
  closeMobileTabHandler,
  lng,
}: LanguageSwitcherProps) => {
  const [showLanguageOptions, setShowLanguageOptions] =
    useState<boolean>(false);
  const pathname = usePathname();

  const closeMobileTab = () => {
    closeMobileTabHandler && closeMobileTabHandler();
    setShowLanguageOptions(false);
  };

  const changeLanguage = (lng: string) => {
    i18next.changeLanguage(lng);
    closeMobileTab();
  };

  return (
    <>
      <div
        className='relative flex cursor-pointer flex-row gap-2 px-3'
        onClick={() =>
          setShowLanguageOptions((currentStatus) => !currentStatus)
        }
      >
        {lng === 'pt' ? (
          <>
            <div className='flex h-4 w-6'>
              <PT title='PT' />
            </div>
            <label className='my-auto text-xs'>PT</label>
          </>
        ) : (
          <>
            <div className='flex h-4 w-6'>
              <GB title='EN' />
            </div>
            <label className='my-auto text-xs'>EN</label>
          </>
        )}
        <PiCaretDownThin />
      </div>
      {showLanguageOptions && (
        <div className='z-100 absolute mt-2 flex w-fit cursor-pointer flex-col gap-2 bg-white py-1 pl-3 pr-5'>
          {lng !== 'en' && (
            <div
              className='flew-row flex gap-2'
              onClick={() => changeLanguage('en')}
            >
              <div className='flex h-4 w-6 cursor-pointer'>
                <GB title='EN' />
              </div>
              <label
                className={classNames('my-auto text-xs', {
                  'text-bege-light': lng == 'en',
                })}
              >
                EN
              </label>
            </div>
          )}
          {lng !== 'pt' && (
            <div
              className='flew-row flex gap-2'
              onClick={() => changeLanguage('pt')}
            >
              <div className='flex h-4 w-6 cursor-pointer'>
                <PT title='PT' />
              </div>
              <label
                className={classNames('my-auto text-xs', {
                  'text-bege-dark': lng == 'pt',
                })}
              >
                PT
              </label>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default LanguageSwitcher;
