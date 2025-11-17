'use client';

import { PT, GB } from 'country-flag-icons/react/3x2';
import classNames from 'classnames';

import { useLanguageCookie, useSetLanguageCookie } from '@/utils/contexts/AppProvider';
import { Language } from '@/i18n/settings';

type LanguageSwitcherProps = {
  isFooter?: boolean;
};

const LanguageSwitcher = ({ isFooter = false }: LanguageSwitcherProps) => {
  const lng = useLanguageCookie();
  const setLng = useSetLanguageCookie();

  const changeLanguage = (newLng: Language) => {
    setLng(newLng);
    const urlValues = window.location.pathname
      .split('/')
      .filter((item) => item != '')
      .splice(1);

    const newPath = `/${newLng}/${urlValues.join('/')}`;
    window.location.href = newPath;
  };

  return (
    <>
      <div
        className={classNames('relative flex cursor-pointer flex-row gap-2 px-3', {
          'border-r pr-3': isFooter,
        })}
      >
        <div
          className={classNames('flex h-4 w-6', {
            'my-auto': isFooter,
          })}
          onClick={() => changeLanguage('pt')}
        >
          <PT title='PT' className={classNames({ grayscale: lng != 'pt' })} />
        </div>
        <div
          className={classNames('flex h-4 w-6', {
            'my-auto': isFooter,
          })}
          onClick={() => changeLanguage('en')}
        >
          <GB title='EN' className={classNames({ grayscale: lng != 'en' })} />
        </div>
      </div>
    </>
  );
};

export default LanguageSwitcher;
