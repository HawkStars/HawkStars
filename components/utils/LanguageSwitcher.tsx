'use client';

import { PT, GB, FlagComponent } from 'country-flag-icons/react/3x2';

import { useLanguageCookie, useSetLanguageCookie } from '@/utils/contexts/AppProvider';
import { Language } from '@/i18n/settings';
import { cn } from '@/lib/utils';

type FlagIconProps = {
  icon: FlagComponent;
  title: string;
  value: Language;
};

const HawkStarsIcons = [
  {
    icon: PT,
    title: 'PT',
    value: 'pt',
  },
  {
    icon: GB,
    title: 'EN',
    value: 'en',
  },
] as FlagIconProps[];

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
    <div
      className={cn('relative flex cursor-pointer flex-row gap-2 px-3', {
        'border-r pr-3': isFooter,
      })}
    >
      {HawkStarsIcons.map(({ icon: Icon, title, value }, index) => (
        <div
          key={index}
          className={cn('flex h-4 w-6', {
            'my-auto': isFooter,
          })}
          onClick={() => changeLanguage(value)}
        >
          <Icon title={title} className={cn({ 'grayscale hover:grayscale-50': lng != value })} />
        </div>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
