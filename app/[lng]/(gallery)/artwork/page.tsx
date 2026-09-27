import Link from 'next/link';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { getMetadataPageInfo } from '@/utils/metadata';
import { transformUrl, SITE_GET_URLS } from '@/utils/paths';
import { LanguageProps } from '@/components/types';
import { getArtworksQuery } from '@/lib/payload/queries/artwork';
import { ART_CATEGORIES } from '@/payload/collections/ArtCollection/categories';
import { Button } from '@/components/ui/button';
import { PageHero } from '@/components/art/ui';
import CatalogFilters from '@/components/art/catalog/CatalogFilters';
import { ArtworkCard } from '@/components/art/artwork/ArtworkCard';

type CatalogPageProps = {
  params: Promise<LanguageProps>;
  searchParams: Promise<{ category?: string; artist?: string }>;
};

export async function generateMetadata(props: CatalogPageProps): Promise<Metadata> {
  const { lng } = await props.params;
  return getMetadataPageInfo(lng as Language, 'artwork');
}

const isCategory = (value?: string) => ART_CATEGORIES.some((category) => category.value === value);

export default async function CatalogPage(props: CatalogPageProps) {
  const [{ lng }, searchParams] = await Promise.all([props.params, props.searchParams]);
  const category = isCategory(searchParams.category) ? searchParams.category : undefined;
  const artist = searchParams.artist?.slice(0, 100);

  const [{ t }, artworks] = await Promise.all([
    getServerTranslation(lng, 'art'),
    getArtworksQuery(lng, { category, artist }),
  ]);

  return (
    <>
      <PageHero title={t('catalog.title')} subtitle={t('catalog.subtitle')} />

      <section className='px-4 py-12 lg:px-8 lg:py-16'>
        <div className='mx-auto max-w-7xl'>
          <Suspense fallback={null}>
            <CatalogFilters
              searchParam='artist'
              searchLabel={t('catalog.search_label')}
              searchPlaceholder={t('catalog.search_placeholder')}
              categoriesLabel={t('catalog.categories')}
              allLabel={t('catalog.all')}
              summary={t('catalog.count', { count: artworks.totalDocs })}
              previousLabel={t('home.scroll_previous')}
              nextLabel={t('home.scroll_next')}
              categories={ART_CATEGORIES.map(({ value, label }) => ({ value, label: label[lng] }))}
            />
          </Suspense>

          {artworks.docs.length > 0 ? (
            <div className='mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3'>
              {artworks.docs.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} lng={lng} />
              ))}
            </div>
          ) : (
            <div className='mt-14 flex flex-col items-center gap-6 py-16 text-center'>
              <p className='text-art-text-2'>{t('catalog.empty')}</p>
              <Button asChild variant='art-outline' size='art'>
                <Link href={transformUrl(lng, SITE_GET_URLS.artwork)}>{t('catalog.clear')}</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
