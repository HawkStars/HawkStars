'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { Language } from '@/i18n/settings';
import { useTranslation } from '@/i18n/client';
import { cn } from '@/lib/utils';

type LanguageOption = {
  code: string;
  label: string;
  value: Language;
};

// Text codes rather than flags: a flag names a country, not a language
// (EN is not only British), and two flags read as decoration, not a control.
const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'PT', label: 'Português', value: 'pt' },
  { code: 'EN', label: 'English', value: 'en' },
];

type LanguageSwitcherProps = {
  isFooter?: boolean;
};

type LanguageLinksProps = LanguageSwitcherProps & {
  /** Serialized query string (without the leading `?`), or '' when none. */
  search: string;
};

const LanguageLinks = ({ isFooter = false, search }: LanguageLinksProps) => {
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

    const url = rest.length > 0 ? `/${newLng}/${rest.join('/')}` : `/${newLng}`;

    return search ? `${url}?${search}` : url;
  };

  return (
    // Inherits the surrounding text colour, so it works on the beige, Erasmus,
    // gallery and crowdfunding navbars alike.
    <div
      className={cn('relative flex flex-row items-center px-3 text-sm', {
        'mr-1 border-r border-current/20 pr-3': isFooter,
      })}
    >
      {LANGUAGE_OPTIONS.map(({ code, label, value }, index) => {
        const isCurrent = lng === value;

        return (
          <span key={value} className='flex items-center'>
            {index > 0 && (
              <span aria-hidden='true' className='px-1.5 opacity-40'>
                ·
              </span>
            )}
            <Link
              href={buildLocalizedPath(value)}
              hrefLang={value}
              lang={value}
              aria-label={t('a11y.switchToLanguage', { language: label })}
              aria-current={isCurrent ? 'true' : undefined}
              className={cn(
                'focus-visible:ring-ring rounded-xs px-1 py-1 tracking-wide transition-opacity focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden',
                isCurrent
                  ? 'font-bold underline decoration-2 underline-offset-[6px]'
                  : 'font-medium opacity-60 hover:opacity-100'
              )}
            >
              {code}
            </Link>
          </span>
        );
      })}
    </div>
  );
};

// `useSearchParams()` is request-time data. With `cacheComponents` enabled it
// must sit under a <Suspense> boundary, otherwise it blocks prerendering of
// every page that renders the navbar/footer. Isolating it here keeps the rest
// of the switcher static.
const LanguageLinksWithSearchParams = (props: LanguageSwitcherProps) => {
  const searchParams = useSearchParams();

  return <LanguageLinks {...props} search={searchParams.toString()} />;
};

const LanguageSwitcher = (props: LanguageSwitcherProps) => (
  // Fallback renders the same links without the query string, so the flags
  // are in the prerendered HTML (no layout shift) and still work pre-hydration.
  <Suspense fallback={<LanguageLinks {...props} search='' />}>
    <LanguageLinksWithSearchParams {...props} />
  </Suspense>
);

export default LanguageSwitcher;
