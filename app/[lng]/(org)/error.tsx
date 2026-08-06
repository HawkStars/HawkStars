'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SITE_GET_URLS, transformUrl } from '@/utils/paths';
import type { Language } from '@/i18n/settings';
import { languages, fallbackLng } from '@/i18n/settings';
import { useTranslation } from '@/i18n/client';

function detectLanguage(pathname: string): Language {
  const segment = pathname.split('/')[1];
  if (segment && languages.includes(segment as Language)) {
    return segment as Language;
  }
  return fallbackLng;
}

/**
 * Error boundary for every route under the `(org)` group.
 *
 * Without this file, a thrown error inside any page here escalates all the
 * way up to `app/global-error.tsx`, which replaces the *entire* document —
 * losing the Navbar/Footer/AppProvider chrome that `(org)/layout.tsx`
 * renders around every page. This keeps that chrome in place and shows a
 * localized message instead of a blank/broken shell.
 */
export default function OrgError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const lng = detectLanguage(pathname);
  const { t } = useTranslation(lng, 'common');

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <main className='bg-bege-light flex min-h-[60vh] flex-col items-center justify-center px-6 text-center'>
      <div className='max-w-lg'>
        <h1 className='text-green text-h2_bold'>{t('errors.pageTitle')}</h1>
        <p className='text-body_regular text-disabled mt-4'>{t('errors.generic')}</p>

        <div className='mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4'>
          <Button size='lg' onClick={() => reset()}>
            {t('actions.tryAgain')}
          </Button>

          <Button asChild variant='outline' size='lg'>
            <Link href={transformUrl(lng, SITE_GET_URLS.home)}>{t('notFound.backHome')}</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
