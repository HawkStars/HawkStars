import Link from 'next/link';
import { Metadata } from 'next';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { getMetadataPageInfo } from '@/utils/metadata';
import { SITE_GET_URLS, transformUrl } from '@/utils/paths';
import { LanguageProps } from '@/components/types';
import { News } from '@/payload-types';
import { getArtGalleryNewsQuery } from '@/lib/payload/queries/artwork';
import { cn } from '@/lib/utils';
import { PageHero } from '@/components/art/ui';
import { GalleryNewsCard } from '@/components/art/news/GalleryNewsCard';

const NEWS_TYPES: News['type'][] = ['news', 'blog', 'press_release', 'announcement', 'other'];

type GalleryNewsPageProps = {
  params: Promise<LanguageProps>;
  searchParams: Promise<{ type?: string }>;
};

export async function generateMetadata(props: GalleryNewsPageProps): Promise<Metadata> {
  const { lng } = await props.params;
  return getMetadataPageInfo(lng as Language, 'gallery_news');
}

export default async function GalleryNewsPage(props: GalleryNewsPageProps) {
  const [{ lng }, searchParams] = await Promise.all([props.params, props.searchParams]);
  const type = NEWS_TYPES.find((value) => value === searchParams.type);
  const [{ t }, news] = await Promise.all([
    getServerTranslation(lng, 'art'),
    getArtGalleryNewsQuery(lng, { type }),
  ]);

  const baseUrl = transformUrl(lng, SITE_GET_URLS.gallery_news);
  const chips = [
    { label: t('news.all'), href: baseUrl, active: !type },
    ...NEWS_TYPES.map((value) => ({
      label: t(`news.types.${value}`),
      href: `${baseUrl}?type=${value}`,
      active: type === value,
    })),
  ];

  return (
    <>
      <PageHero title={t('news.title')} subtitle={t('news.subtitle')} />

      <section className='px-4 py-12 lg:px-8 lg:py-16'>
        <div className='mx-auto max-w-7xl'>
          <nav
            aria-label={t('news.title')}
            className='border-art-line overflow-x-auto border-b pb-4'
          >
            <ul className='flex gap-2'>
              {chips.map((chip) => (
                <li key={chip.href}>
                  <Link
                    href={chip.href}
                    scroll={false}
                    aria-current={chip.active ? 'page' : undefined}
                    className={cn(
                      'block shrink-0 border px-4 py-2 text-xs tracking-wider whitespace-nowrap transition-colors',
                      chip.active
                        ? 'border-art-gold-bright text-art-gold-bright'
                        : 'text-art-text-2 hover:text-art-text border-transparent'
                    )}
                  >
                    {chip.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {news.docs.length > 0 ? (
            <div className='mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
              {news.docs.map((article) => (
                <GalleryNewsCard key={article.id} article={article} lng={lng} />
              ))}
            </div>
          ) : (
            <p className='text-art-text-2 py-20 text-center'>{t('news.empty')}</p>
          )}
        </div>
      </section>
    </>
  );
}
