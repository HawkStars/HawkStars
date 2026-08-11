import * as Sentry from '@sentry/nextjs';
import { Artwork, Curator } from '@/payload-types';
import { getPayloadConfig } from '../server';
import { Language } from '@/i18n/settings';
// import { cacheLife, cacheTag } from 'next/cache';
// import { ART_COLLECTION_CACHE_TAG } from '@/payload/collections/ArtCollection';
// import { CURATOR_CACHE_TAG } from '@/payload/collections/Curator';

export const getSingleArtwork = async (slug: string, locale: Language): Promise<Artwork | null> => {
  try {
    const payload = await getPayloadConfig();
    const data = await payload.find({
      collection: 'artworks',
      locale,
      where: { slug: { equals: slug } },
    });

    const artwork = data.docs.length > 0 ? (data.docs[0] as Artwork) : null;
    return artwork;
  } catch (error) {
    Sentry.captureException(error);
    return null;
  }
};

export const getSingleCuratorQuery = async (
  slug: string,
  locale: Language
): Promise<Curator | undefined> => {
  try {
    const payload = await getPayloadConfig();
    const curator = await payload.find({
      collection: 'curators',
      locale,
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
    });

    return curator.docs[0] as Curator;
  } catch (error) {
    Sentry.captureException(error);
    return undefined;
  }
};

// The two list queries below are cached for the same reason the single-document
// lookups on the artwork/curator routes are: an uncached Payload call reached
// during prerendering bails the whole route out with "Next.js encountered the
// unstable value `Date.now()` while prerendering". Being inside a <Suspense>
// boundary only keeps that hole from blocking the shell — it does not make the
// hole cacheable, so these still had to be paid on every request.
export const getAllArtworkImagesQuery = async (locale: Language) => {
  // 'use cache';
  // cacheLife('hours');
  // cacheTag(ART_COLLECTION_CACHE_TAG);

  const payload = await getPayloadConfig();
  const artworks = await payload.find({ collection: 'artworks', limit: 100, locale });
  return artworks;
};

export const allCuratorsQuery = async (locale: Language) => {
  // 'use cache';
  // cacheLife('hours');
  // cacheTag(CURATOR_CACHE_TAG);

  const payload = await getPayloadConfig();
  const curators = await payload.find({ collection: 'curators', limit: 100, locale });
  return curators;
};
