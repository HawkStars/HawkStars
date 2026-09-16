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
 * Error boundary for every route under the `(crowdfunding)` group.
 *
 * Same reasoning as `(org)/error.tsx`: without this file a thrown error here
 * escalates to `app/global-error.tsx`, which replaces the entire document and
 * takes the CrowdfundingNavbar and AppProvider with it — leaving an unstyled,
 * untranslated, un-navigable page on the sub-site that carries the donation
 * flow. The "back" link returns to the campaign root rather than the org
 * homepage, since that is where a visitor here was headed.
 */
export default function CrowdfundingError({
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
    <div className='bg-bege-light flex min-h-[60vh] flex-col items-center justify-center px-6 text-center'>
      <div className='max-w-lg'>
        <h1 className='text-green text-h2_bold'>{t('errors.pageTitle')}</h1>
        <p className='text-body_regular text-disabled mt-4'>{t('errors.generic')}</p>

        <div className='mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4'>
          <Button size='lg' onClick={() => reset()}>
            {t('actions.tryAgain')}
          </Button>

          <Button asChild variant='outline' size='lg'>
            <Link href={transformUrl(lng, SITE_GET_URLS.crowdfunding)}>
              {t('notFound.backHome')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
