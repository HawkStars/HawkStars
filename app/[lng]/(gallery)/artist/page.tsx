import { Metadata } from 'next';
import { Suspense } from 'react';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { getMetadataPageInfo } from '@/utils/metadata';
import { LanguageProps } from '@/components/types';
import { allArtistsQuery, getArtworksQuery } from '@/lib/payload/queries/artwork';
import { ART_CATEGORIES } from '@/payload/collections/ArtCollection/categories';
import { PageHero } from '@/components/art/ui';
import CatalogFilters from '@/components/art/catalog/CatalogFilters';
import ArtistRow from '@/components/art/artists/ArtistRow';
import ProposalForm from '@/components/art/propose/ProposalForm';
import { groupArtworksBy } from '@/components/art/artists/helpers';

type ArtistsPageProps = {
  params: Promise<LanguageProps>;
  searchParams: Promise<{ q?: string; category?: string }>;
};

export async function generateMetadata(props: ArtistsPageProps): Promise<Metadata> {
  const { lng } = await props.params;
  return getMetadataPageInfo(lng as Language, 'artists');
}

export default async function ArtistsPage(props: ArtistsPageProps) {
  const [{ lng }, searchParams] = await Promise.all([props.params, props.searchParams]);
  const [{ t }, { docs }, { docs: artworks }] = await Promise.all([
    getServerTranslation(lng, 'art'),
    allArtistsQuery(lng, searchParams.q?.slice(0, 100)),
    getArtworksQuery(lng),
  ]);
  const worksByArtist = groupArtworksBy(artworks, 'artist');
  const worksOf = (id: string) => worksByArtist.get(id) ?? [];

  const category = searchParams.category;
  const artists = category
    ? docs.filter((artist) => worksOf(artist.id).some((work) => work.category === category))
    : docs;

  return (
    <>
      <PageHero title={t('artists.title')} subtitle={t('artists.subtitle')} />

      <section className='px-4 py-12 lg:px-8 lg:py-16'>
        <div className='mx-auto max-w-7xl'>
          <Suspense fallback={null}>
            <CatalogFilters
              searchParam='q'
              searchLabel={t('artists.search_label')}
              searchPlaceholder={t('artists.search_placeholder')}
              submitLabel={t('artists.filter')}
              categoriesLabel={t('artists.disciplines')}
              previousLabel={t('home.scroll_previous')}
              nextLabel={t('home.scroll_next')}
              categories={ART_CATEGORIES.map(({ value, label }) => ({ value, label: label[lng] }))}
            />
          </Suspense>

          {artists.length > 0 ? (
            <div className='mt-14 flex flex-col gap-10'>
              {artists.map((artist) => (
                <ArtistRow key={artist.id} artist={artist} works={worksOf(artist.id)} lng={lng} />
              ))}
            </div>
          ) : (
            <p className='text-art-text-2 mt-14 py-16 text-center'>{t('artists.empty')}</p>
          )}
        </div>
      </section>

      <ProposalForm />
    </>
  );
}
