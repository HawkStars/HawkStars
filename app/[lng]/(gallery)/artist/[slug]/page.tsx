import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServerTranslation } from '@/i18n';
import { LanguageProps } from '@/components/types';
import { prepareMetadataInfo } from '@/utils/metadata';
import { getArtworkByArtistQuery, getSingleArtistQuery } from '@/lib/payload/queries/artwork';
import { SectionHeader } from '@/components/art/ui';
import ProfileHero from '@/components/art/profile/ProfileHero';
import { ArtworkCard } from '@/components/art/artwork/ArtworkCard';
import RelatedGalleryNews from '@/components/art/news/RelatedGalleryNews';
import { artworkDisciplines } from '@/components/art/artists/helpers';
import { richTextToPlain } from '@/components/art/artwork/helpers';

type ArtistPageProps = { params: Promise<LanguageProps & { slug: string }> };

export async function generateMetadata(props: ArtistPageProps): Promise<Metadata> {
  const { lng, slug } = await props.params;
  const artist = await getSingleArtistQuery(slug, lng);
  if (!artist) return {};

  return prepareMetadataInfo({
    title: artist.seo?.seo?.title || artist.name,
    description:
      artist.seo?.seo?.description || richTextToPlain(artist.description, 155) || undefined,
    image: artist.image,
    url: `/artist/${slug}`,
    lng,
  });
}

export default async function ArtistPage(props: ArtistPageProps) {
  const { lng, slug } = await props.params;
  const artist = await getSingleArtistQuery(slug, lng);
  if (!artist) notFound();

  const [{ t }, { docs: artworks }] = await Promise.all([
    getServerTranslation(lng, 'art'),
    getArtworkByArtistQuery(artist.id, lng),
  ]);

  return (
    <>
      <ProfileHero
        name={artist.name}
        eyebrow={artworkDisciplines(artworks, lng).join(' • ') || t('artwork.artist')}
        subtitle={artist.location}
        image={artist.image}
        description={artist.description}
        links={artist.links}
        lng={lng}
      />

      {artworks.length > 0 && (
        <section className='border-art-line border-t px-4 py-16 lg:px-8 lg:py-20'>
          <div className='mx-auto max-w-7xl'>
            <SectionHeader title={t('artists.works', { name: artist.name })} />
            <div className='mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3'>
              {artworks.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} lng={lng} />
              ))}
            </div>
          </div>
        </section>
      )}

      <RelatedGalleryNews relatedId={artist.id} lng={lng} title={t('related_news')} />
    </>
  );
}
