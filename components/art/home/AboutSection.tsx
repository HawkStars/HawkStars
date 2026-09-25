import Link from 'next/link';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { Button } from '@/components/ui/button';
import { SITE_GET_URLS, transformUrl } from '@/utils/paths';
import { GalleryLogo } from '../ui/GalleryLogo';

const FACTS = [
  { title: 'home.facts.curators_title', text: 'home.facts.curators' },
  { title: 'home.facts.management_title', text: 'home.facts.management' },
  {
    title: 'home.facts.project_title',
    text: 'home.facts.project',
    detail: 'home.facts.project_detail',
    accent: true,
  },
  { title: 'home.facts.future_title', text: 'home.facts.future' },
] as const;

export default async function AboutSection({ lng }: { lng: Language }) {
  const { t } = await getServerTranslation(lng, 'art');

  return (
    <section className='border-art-line border-t px-4 py-20 lg:px-8 lg:py-28'>
      <GalleryLogo
        variant='footer'
        by={t('brand.by')}
        name={t('brand.name')}
        tagline={t('brand.tagline')}
        className='mx-auto mb-14 block h-40 md:mb-20 md:h-48'
      />
      <div className='mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20'>
        <div className='flex flex-col gap-6'>
          <p className='art-eyebrow'>{t('home.about_eyebrow')}</p>
          <h2 className='art-heading md:text-5xl'>{t('home.about_title')}</h2>
          <div className='art-justify text-art-text-2 flex flex-col gap-5 text-base leading-relaxed md:text-lg'>
            <p>{t('home.about_1')}</p>
            <p>{t('home.about_2')}</p>
            <p>{t('home.about_3')}</p>
          </div>
          <blockquote className='art-justify border-art-gold text-art-text-2 border-l-2 pl-5 text-sm italic'>
            {t('home.about_quote')}
          </blockquote>
        </div>

        <aside className='art-panel flex flex-col gap-4 self-start p-6 md:p-8'>
          {FACTS.map((fact) => (
            <div key={fact.title} className='border-art-line bg-art-ebony/60 border p-4'>
              <p
                className={
                  'accent' in fact
                    ? 'art-eyebrow text-art-terracotta text-[10px]'
                    : 'art-eyebrow text-[10px]'
                }
              >
                {t(fact.title)}
              </p>
              <p className='art-justify text-art-text mt-2 text-sm'>{t(fact.text)}</p>
              {'detail' in fact && (
                <p className='art-justify text-art-muted mt-1 text-sm'>{t(fact.detail)}</p>
              )}
            </div>
          ))}
          <Button asChild variant='art' size='art' className='mt-2 w-full'>
            <Link href={transformUrl(lng, SITE_GET_URLS.artwork)}>{t('home.explore_cta')}</Link>
          </Button>
        </aside>
      </div>
    </section>
  );
}
