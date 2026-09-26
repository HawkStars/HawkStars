import Link from 'next/link';
import { Metadata } from 'next';
import { LuArrowRight } from 'react-icons/lu';
import { LanguagePageProps } from '@/app/[lng]/(org)/types';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { getMetadataPageInfo } from '@/utils/metadata';
import { SITE_GET_URLS, transformUrl } from '@/utils/paths';
import { Artist } from '@/payload-types';
import {
  allArtistsQuery,
  allCuratorsQuery,
  getArtGalleryNewsQuery,
  getArtworksQuery,
  getFeaturedArtworksQuery,
  getGallerySettings,
} from '@/lib/payload/queries/artwork';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/art/ui';
import { ScrollCarousel } from '@/components/art/ui/ScrollCarousel';
import { GalleryLogo } from '@/components/art/ui/GalleryLogo';
import HeroCarousel, { HeroSlide } from '@/components/art/home/HeroCarousel';
import AboutSection from '@/components/art/home/AboutSection';
import CuratorsSection from '@/components/art/home/CuratorsSection';
import ProposeSection from '@/components/art/propose/ProposeSection';
import { ArtworkShowcaseCard } from '@/components/art/artwork/ArtworkCard';
import { ArtistCard } from '@/components/art/artists/ArtistCard';
import { groupArtworksBy } from '@/components/art/artists/helpers';
import { GalleryNewsCard } from '@/components/art/news/GalleryNewsCard';
import {
  artworkImage,
  artworkSpecs,
  artworkUrl,
  populated,
} from '@/components/art/artwork/helpers';

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const { lng } = await props.params;
  return getMetadataPageInfo(lng as Language, 'gallery');
}

export default async function GalleryHomePage(props: LanguagePageProps) {
  const { lng } = await props.params;
  const [{ t }, featured, curators, artworks, artists, news, settings, allArtworks] =
    await Promise.all([
      getServerTranslation(lng, 'art'),
      getFeaturedArtworksQuery(lng),
      allCuratorsQuery(lng),
      getArtworksQuery(lng, { limit: 9 }),
      allArtistsQuery(lng),
      getArtGalleryNewsQuery(lng, { limit: 3 }),
      getGallerySettings(lng),
      getArtworksQuery(lng),
    ]);
  const worksByArtist = groupArtworksBy(allArtworks.docs, 'artist');

  const slides: HeroSlide[] = featured.map((artwork) => ({
    id: artwork.id,
    href: artworkUrl(lng, artwork),
    title: artwork.title,
    artistName: populated<Artist>(artwork.artist)?.name,
    year: artwork.year,
    specs: artworkSpecs(artwork, lng),
    image: artworkImage(artwork),
  }));

  const carouselLabels = {
    previousLabel: t('home.scroll_previous'),
    nextLabel: t('home.scroll_next'),
  };

  return (
    <>
      <section className='art-spotlight px-4 pt-16 pb-20 lg:px-8 lg:pt-20'>
        <div className='mx-auto flex max-w-4xl flex-col items-center text-center'>
          <p className='border-art-line text-art-gold-bright flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-semibold tracking-[0.15em] uppercase'>
            <span aria-hidden className='bg-art-brass h-1.5 w-1.5 rounded-full' />
            {t('home.welcome')}
          </p>
          <h1 className='mt-8'>
            <GalleryLogo
              by={t('brand.by')}
              name={t('brand.name')}
              tagline={t('brand.tagline')}
              className='h-20 md:h-28'
            />
          </h1>
        </div>
        <div className='mt-12'>
          <HeroCarousel
            slides={slides}
            labels={{ previous: t('home.previous'), next: t('home.next'), goTo: t('home.go_to') }}
          />
        </div>
      </section>

      <AboutSection lng={lng} />
      <CuratorsSection curators={curators.docs} lng={lng} />

      {artworks.docs.length > 0 && (
        <section className='bg-art-ebony border-art-line border-t px-4 py-20 lg:px-8 lg:py-28'>
          <div className='mx-auto max-w-7xl'>
            <SectionHeader
              eyebrow={t('home.artworks_eyebrow')}
              title={t('home.artworks_title')}
              actions={
                <Button asChild variant='art' size='art'>
                  <Link href={transformUrl(lng, SITE_GET_URLS.artwork)}>
                    {t('home.artworks_cta')}
                    <LuArrowRight aria-hidden />
                  </Link>
                </Button>
              }
            />
            <div className='mt-10'>
              <ScrollCarousel {...carouselLabels} autoplay>
                {artworks.docs.map((artwork) => (
                  <ArtworkShowcaseCard key={artwork.id} artwork={artwork} lng={lng} />
                ))}
              </ScrollCarousel>
            </div>
          </div>
        </section>
      )}

      {artists.docs.length > 0 && (
        <section className='border-art-line border-t px-4 py-20 lg:px-8 lg:py-28'>
          <div className='mx-auto max-w-7xl'>
            <SectionHeader
              eyebrow={t('home.artists_eyebrow')}
              title={t('home.artists_title')}
              actions={
                <Button asChild variant='art' size='art'>
                  <Link href={transformUrl(lng, SITE_GET_URLS.artists)}>
                    {t('home.artists_cta')}
                    <LuArrowRight aria-hidden />
                  </Link>
                </Button>
              }
            />
            <div className='mt-10'>
              <ScrollCarousel
                {...carouselLabels}
                autoplay
                itemClassName='w-[75%] sm:w-[45%] lg:w-[calc((100%-6rem)/4)]'
              >
                {artists.docs.map((artist) => (
                  <ArtistCard
                    key={artist.id}
                    artist={artist}
                    works={worksByArtist.get(artist.id) ?? []}
                    lng={lng}
                  />
                ))}
              </ScrollCarousel>
            </div>
          </div>
        </section>
      )}

      {news.docs.length > 0 && (
        <section className='bg-art-ebony border-art-line border-t px-4 py-20 lg:px-8 lg:py-28'>
          <div className='mx-auto max-w-7xl'>
            <SectionHeader
              eyebrow={t('home.news_eyebrow')}
              title={t('home.news_title')}
              actions={
                <Button asChild variant='art-outline' size='art'>
                  <Link href={transformUrl(lng, SITE_GET_URLS.gallery_news)}>
                    {t('home.news_cta')}
                  </Link>
                </Button>
              }
            />
            <div className='mt-10 grid gap-8 md:grid-cols-3'>
              {news.docs.map((article) => (
                <GalleryNewsCard key={article.id} article={article} lng={lng} />
              ))}
            </div>
          </div>
        </section>
      )}

      <ProposeSection lng={lng} share={settings.social_impact_share} />
    </>
  );
}
