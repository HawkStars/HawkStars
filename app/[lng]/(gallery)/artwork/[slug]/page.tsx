import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LuArrowRight, LuQuote } from 'react-icons/lu';
import { getServerTranslation } from '@/i18n';
import { LanguageProps } from '@/components/types';
import { prepareMetadataInfo } from '@/utils/metadata';
import { SITE_GET_URLS, transformUrl } from '@/utils/paths';
import { Artist, Curator, Media } from '@/payload-types';
import {
  getArtworkByArtistQuery,
  getGallerySettings,
  getSingleArtwork,
} from '@/lib/payload/queries/artwork';
import { getArtCategoryLabel } from '@/payload/collections/ArtCollection/categories';
import { formatDimensions } from '@/lib/art-gallery/dimensions';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/art/ui';
import { ArtRichText } from '@/components/art/ui/ArtRichText';
import { ScrollCarousel } from '@/components/art/ui/ScrollCarousel';
import ArtworkViewer, { ViewerView } from '@/components/art/artwork/ArtworkViewer';
import ArtworkSpecs from '@/components/art/artwork/ArtworkSpecs';
import AcquisitionPanel from '@/components/art/artwork/AcquisitionPanel';
import { ArtworkShowcaseCard } from '@/components/art/artwork/ArtworkCard';
import RelatedGalleryNews from '@/components/art/news/RelatedGalleryNews';
import {
  artistUrl,
  artworkImage,
  curatorUrl,
  populated,
  richTextToPlain,
} from '@/components/art/artwork/helpers';

type ArtworkPageProps = { params: Promise<LanguageProps & { slug: string }> };

export async function generateMetadata(props: ArtworkPageProps): Promise<Metadata> {
  const { lng, slug } = await props.params;
  const artwork = await getSingleArtwork(slug, lng);
  if (!artwork) return {};

  const artist = populated<Artist>(artwork.artist);
  return prepareMetadataInfo({
    title: [artwork.title, artist?.name].filter(Boolean).join(' — '),
    description: richTextToPlain(artwork.synopsis, 155) || undefined,
    image: artworkImage(artwork),
    urlPath: `/artwork/${slug}`,
    lng,
  });
}

export default async function ArtworkPage(props: ArtworkPageProps) {
  const { lng, slug } = await props.params;
  const [artwork, settings, { t }] = await Promise.all([
    getSingleArtwork(slug, lng),
    getGallerySettings(lng),
    getServerTranslation(lng, 'art'),
  ]);
  if (!artwork) notFound();

  const artist = populated<Artist>(artwork.artist);
  const curator = populated<Curator>(artwork.curator);
  const image = artworkImage(artwork);
  const category = getArtCategoryLabel(artwork.category, lng);
  const catalogUrl = transformUrl(lng, SITE_GET_URLS.artwork);

  const views: ViewerView[] = [
    ...(image ? [{ id: image.id, label: t('artwork.viewer.main_view'), image }] : []),
    ...(artwork.environment_images ?? [])
      .map((item) => populated<Media>(item))
      .filter((item): item is Media => !!item)
      .map((item, index) => ({
        id: item.id,
        label: t('artwork.viewer.environment', { n: index + 1 }),
        image: item,
      })),
  ];

  const moreByArtist = artist
    ? (await getArtworkByArtistQuery(artist.id, lng)).docs.filter((doc) => doc.id !== artwork.id)
    : [];

  return (
    <>
      <nav aria-label='Breadcrumb' className='mx-auto max-w-7xl px-4 pt-6 lg:px-8'>
        <ol className='text-art-muted flex flex-wrap items-center gap-2 text-xs'>
          <li>
            <Link href={catalogUrl} className='hover:text-art-text'>
              {t('artwork.catalog')}
            </Link>
          </li>
          {category && (
            <li className='flex items-center gap-2'>
              <span aria-hidden>/</span>
              <Link
                href={`${catalogUrl}?category=${artwork.category}`}
                className='hover:text-art-text'
              >
                {category}
              </Link>
            </li>
          )}
          <li className='text-art-cream flex items-center gap-2' aria-current='page'>
            <span aria-hidden>/</span>
            {artwork.title}
          </li>
        </ol>
      </nav>

      <header className='px-4 pt-8 pb-10 text-center lg:px-8'>
        {artwork.reference && (
          <p className='art-eyebrow'>{t('artwork.reference', { ref: artwork.reference })}</p>
        )}
        <h1 className='art-display mt-4'>{artwork.title}</h1>
        {artist && (
          <Link
            href={artistUrl(lng, artist)}
            className='font-art-serif text-art-gold hover:text-art-gold-bright mt-3 inline-block text-2xl italic'
          >
            {artist.name}
          </Link>
        )}
        {curator && (
          <p className='art-eyebrow text-art-text-2 mt-3 text-[10px]'>
            <Link href={curatorUrl(lng, curator)} className='hover:text-art-text'>
              {t('artwork.curated_by', { name: curator.name })}
            </Link>
          </p>
        )}
      </header>

      <section className='mx-auto max-w-6xl px-4 lg:px-8'>
        <ArtworkViewer
          title={artwork.title}
          dimensions={formatDimensions(artwork, lng)}
          views={views}
          labels={{
            zoomIn: t('artwork.viewer.zoom_in'),
            zoomOut: t('artwork.viewer.zoom_out'),
            reset: t('artwork.viewer.reset'),
            open: t('artwork.viewer.open'),
            close: t('artwork.viewer.close'),
            views: t('artwork.viewer.views'),
            protected: t('artwork.viewer.protected'),
          }}
        />
      </section>

      <section className='mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[1.35fr_1fr] lg:px-8'>
        <div className='flex flex-col gap-8'>
          <ArtworkSpecs artwork={artwork} lng={lng} />
          <AcquisitionPanel artwork={artwork} lng={lng} settings={settings} />
        </div>

        <div className='flex flex-col gap-8'>
          {artwork.critical_note?.quote && (
            <figure className='art-panel p-6 md:p-8'>
              <h2 className='font-art-serif text-art-text flex items-center gap-3 text-2xl'>
                <LuQuote aria-hidden className='text-art-gold text-lg' />
                {t('artwork.analysis_title')}
              </h2>
              <blockquote className='border-art-gold font-art-serif text-art-text-2 mt-5 border-l-2 pl-5 text-lg italic'>
                “{artwork.critical_note.quote}”
              </blockquote>
              {artwork.critical_note.author && (
                <figcaption className='art-eyebrow text-art-brass mt-4 text-right text-[10px]'>
                  — {artwork.critical_note.author}
                </figcaption>
              )}
            </figure>
          )}
          {(artwork.synopsis || artwork.extra) && (
            <div className='art-panel flex flex-col gap-4 p-6 md:p-8'>
              <h2 className='font-art-serif text-art-text text-2xl'>{t('artwork.synopsis')}</h2>
              {artwork.synopsis && <ArtRichText data={artwork.synopsis} />}
              {artwork.extra && <ArtRichText data={artwork.extra} />}
            </div>
          )}
        </div>
      </section>

      {artist && moreByArtist.length > 0 && (
        <section className='border-art-line border-t px-4 py-16 lg:px-8 lg:py-20'>
          <div className='mx-auto max-w-7xl'>
            <SectionHeader
              eyebrow={t('artwork.more_eyebrow')}
              title={t('artwork.more_title', { name: artist.name })}
              actions={
                <Button asChild variant='art-ghost' size='art'>
                  <Link href={artistUrl(lng, artist)}>
                    {t('artwork.artist_catalog', { name: artist.name })}
                    <LuArrowRight aria-hidden />
                  </Link>
                </Button>
              }
            />
            <div className='mt-10'>
              <ScrollCarousel
                previousLabel={t('home.scroll_previous')}
                nextLabel={t('home.scroll_next')}
                autoplay
              >
                {moreByArtist.map((item) => (
                  <ArtworkShowcaseCard key={item.id} artwork={item} lng={lng} />
                ))}
              </ScrollCarousel>
            </div>
          </div>
        </section>
      )}

      <RelatedGalleryNews relatedId={artwork.id} lng={lng} title={t('related_news')} />
    </>
  );
}
