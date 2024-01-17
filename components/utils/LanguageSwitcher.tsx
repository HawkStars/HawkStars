'use client';
import { PT, GB } from 'country-flag-icons/react/3x2';
import { useState } from 'react';

import { PiCaretDownThin } from 'react-icons/pi';
import classNames from 'classnames';
import { useLanguageCookie } from '@/hooks/useLanguageCookie';
import { useRouter } from 'next/navigation';

const LanguageSwitcher = () => {
  const router = useRouter();
  const lng = useLanguageCookie();
  const [showLanguageOptions, setShowLanguageOptions] = useState<boolean>(false);

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
            <div className='flew-row flex cursor-pointer gap-2' onClick={() => router.push('/en')}>
              <div className='flex h-4 w-6'>
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
            <div className='flew-row flex cursor-pointer gap-2' onClick={() => router.push('/pt')}>
              <div className='flex h-4 w-6'>
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
