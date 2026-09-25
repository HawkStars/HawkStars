import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServerTranslation } from '@/i18n';
import { LanguageProps } from '@/components/types';
import { prepareMetadataInfo } from '@/utils/metadata';
import { getArtworkByCuratorQuery, getSingleCuratorQuery } from '@/lib/payload/queries/artwork';
import { SectionHeader } from '@/components/art/ui';
import ProfileHero from '@/components/art/profile/ProfileHero';
import { ArtworkCard } from '@/components/art/artwork/ArtworkCard';
import RelatedGalleryNews from '@/components/art/news/RelatedGalleryNews';
import { richTextToPlain } from '@/components/art/artwork/helpers';

type CuratorPageProps = { params: Promise<LanguageProps & { slug: string }> };

export async function generateMetadata(props: CuratorPageProps): Promise<Metadata> {
  const { lng, slug } = await props.params;
  const curator = await getSingleCuratorQuery(slug, lng);
  if (!curator) return {};

  return prepareMetadataInfo({
    title: curator.seo?.seo?.title || curator.name,
    description:
      curator.seo?.seo?.description || richTextToPlain(curator.description, 155) || undefined,
    image: curator.image,
    urlPath: `/curator/${slug}`,
    lng,
  });
}

export default async function CuratorPage(props: CuratorPageProps) {
  const { lng, slug } = await props.params;
  const curator = await getSingleCuratorQuery(slug, lng);
  if (!curator) notFound();

  const [{ t }, { docs: artworks }] = await Promise.all([
    getServerTranslation(lng, 'art'),
    getArtworkByCuratorQuery(curator.id, lng),
  ]);

  return (
    <>
      <ProfileHero
        name={curator.name}
        eyebrow={t('curator.badge')}
        subtitle={curator.role}
        image={curator.image}
        description={curator.description}
        links={curator.links}
        lng={lng}
      />

      {artworks.length > 0 && (
        <section className='border-art-line border-t px-4 py-16 lg:px-8 lg:py-20'>
          <div className='mx-auto max-w-7xl'>
            <SectionHeader title={t('curator.works', { name: curator.name })} />
            <div className='mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3'>
              {artworks.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} lng={lng} />
              ))}
            </div>
          </div>
        </section>
      )}

      <RelatedGalleryNews relatedId={curator.id} lng={lng} title={t('related_news')} />
    </>
  );
}
