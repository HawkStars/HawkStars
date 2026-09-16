import { fallbackLng, Language } from '@/i18n/settings';
import { getServerTranslation } from '@/i18n';

/**
 * WCAG 2.4.1 (Bypass Blocks, Level A): a keyboard user must be able to jump past
 * the navbar instead of tabbing through it on every page.
 *
 * Extracted from `(org)/layout.tsx`, where it lived inline — which is why the
 * `(crowdfunding)` and `(gaming)` sub-sites never got one. Every layout that
 * renders a navbar must render this and give its `<main>` `id='main-content'`.
 *
 * `sr-only focus:not-sr-only` keeps it invisible until it receives focus.
 */
export default async function SkipToContent({ lng }: { lng: string }) {
  const { t } = await getServerTranslation((lng || fallbackLng) as Language, 'common');

  return (
    <a
      href='#main-content'
      className='focus:ring-primary sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-999 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-black focus:ring-2'
    >
      {t('a11y.skipToContent')}
    </a>
  );
}
