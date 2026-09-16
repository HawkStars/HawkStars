'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SITE_GET_URLS, transformUrl } from '@/utils/paths';
import { detectLanguage } from '@/i18n/settings';
import { useTranslation } from '@/i18n/client';

/**
 * Error boundary for every route under the `(gaming)` group.
 *
 * Same reasoning as `(org)/error.tsx`. Styled for this group's dark shell rather
 * than reusing the light `(org)` palette — this renders inside
 * `(gaming)/layout.tsx`, on top of its dark background.
 */
export default function GamingError({
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
    <div className='flex min-h-[60vh] flex-col items-center justify-center px-6 text-center'>
      <div className='max-w-lg'>
        <h1 className='text-h2_bold text-white'>{t('errors.pageTitle')}</h1>
        <p className='text-body_regular mt-4 text-white/70'>{t('errors.generic')}</p>

        <div className='mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4'>
          <Button size='lg' onClick={() => reset()}>
            {t('actions.tryAgain')}
          </Button>

          <Button
            asChild
            variant='outline'
            size='lg'
            className='border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white'
          >
            <Link href={transformUrl(lng, SITE_GET_URLS.gaming)}>{t('notFound.backHome')}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
