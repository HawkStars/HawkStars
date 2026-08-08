'use client';

import { PT, GB, FlagComponent } from 'country-flag-icons/react/3x2';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { Language } from '@/i18n/settings';
import { useTranslation } from '@/i18n/client';
import { cn } from '@/lib/utils';

type FlagIconProps = {
  icon: FlagComponent;
  title: string;
  label: string;
  value: Language;
};

const HawkStarsIcons = [
  {
    icon: PT,
    title: 'PT',
    label: 'Português',
    value: 'pt',
  },
  {
    icon: GB,
    title: 'EN',
    label: 'English',
    value: 'en',
  },
] as FlagIconProps[];

type LanguageSwitcherProps = {
  isFooter?: boolean;
};

const LanguageSwitcher = ({ isFooter = false }: LanguageSwitcherProps) => {
  const lng = useLanguageCookie();
  const pathname = usePathname();
  const { t } = useTranslation(lng, 'common');

  // A11Y-H4: these were `<div onClick>` flags — the language could not be
  // changed by keyboard at all. They are now real links to the localized path,
  // which also makes the target visible on hover/focus and allows
  // open-in-new-tab, instead of an imperative window.location.assign.
  const buildLocalizedPath = (newLng: Language) => {
    const rest = (pathname || '/')
      .split('/')
      .filter((segment) => segment !== '')
      .slice(1);

    return rest.length > 0 ? `/${newLng}/${rest.join('/')}` : `/${newLng}`;
  };

  return (
    <div
      className={cn('relative flex flex-row gap-2 px-3', {
        'border-r pr-3': isFooter,
      })}
    >
      {HawkStarsIcons.map(({ icon: Icon, title, label, value }) => {
        const isCurrent = lng === value;

        return (
          <Link
            key={value}
            href={buildLocalizedPath(value)}
            hrefLang={value}
            lang={value}
            aria-label={t('a11y.switchToLanguage', { language: label })}
            aria-current={isCurrent ? 'true' : undefined}
            className={cn(
              'focus-visible:ring-primary-500 flex h-4 w-6 rounded-xs focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden',
              {
                'my-auto': isFooter,
              }
            )}
          >
            <Icon title={title} className={cn({ 'grayscale hover:grayscale-50': !isCurrent })} />
          </Link>
        );
      })}
    </div>
  );
};

export default LanguageSwitcher;
