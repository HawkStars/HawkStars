import Link from 'next/link';
import { getServerTranslation } from '@/i18n';
import { fallbackLng } from '@/i18n/settings';
import { Button } from '@/components/ui/button';

// not-found.tsx receives no params; the gallery is PT-first, so fall back to it.
export default async function GalleryNotFound() {
  const { t } = await getServerTranslation(fallbackLng, 'art');

  return (
    <section className='art-spotlight flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center'>
      <p className='art-eyebrow'>404</p>
      <h1 className='art-display'>{t('not_found.title')}</h1>
      <p className='art-justify-center text-art-text-2 max-w-md'>{t('not_found.text')}</p>
      <Button asChild variant='art' size='art'>
        <Link href={`/${fallbackLng}/artwork`}>{t('not_found.cta')}</Link>
      </Button>
    </section>
  );
}
