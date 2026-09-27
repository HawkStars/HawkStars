import * as Sentry from '@sentry/nextjs';
import type { Where } from 'payload';
import { ArtGallerySetting, Artist, Artwork, Curator, News } from '@/payload-types';
import { getPayloadConfig } from '../server';
import { Language } from '@/i18n/settings';
import { cacheLife, cacheTag } from 'next/cache';
import { ART_COLLECTION_CACHE_TAG } from '@/payload/collections/ArtCollection';
import { CURATOR_CACHE_TAG } from '@/payload/collections/Curator';
import { ART_GALLERY_SETTINGS_SLUG } from '@/payload/globals/ArtGallerySettings/config';

export const getSingleArtwork = async (slug: string, locale: Language): Promise<Artwork | null> => {
  try {
    const payload = await getPayloadConfig();
    const data = await payload.find({
      collection: 'artworks',
      locale,
      where: { slug: { equals: slug } },
      depth: 2,
      limit: 1,
    });

    return data.docs[0] ?? null;
  } catch (error) {
    Sentry.captureException(error);
    return null;
  }
};

export const getSingleArtistQuery = async (
  slug: string,
  locale: Language
): Promise<Artist | undefined> => {
  try {
    const payload = await getPayloadConfig();
    const artist = await payload.find({
      collection: 'artists',
      locale,
      where: { slug: { equals: slug } },
      limit: 1,
    });

    return artist.docs[0];
  } catch (error) {
    Sentry.captureException(error);
    return undefined;
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
      where: { slug: { equals: slug } },
      limit: 1,
    });

    return curator.docs[0];
  } catch (error) {
    Sentry.captureException(error);
    return undefined;
  }
};

type ArtworksFilter = {
  category?: string;
  /** Free-text search over the artist's name. */
  artist?: string;
  limit?: number;
};

// The list/lookup queries below are uncached for now (`'use cache'` is kept
// commented out, see `cacheComponents` in next.config.ts).
export const getArtworksQuery = async (locale: Language, filter: ArtworksFilter = {}) => {
  const payload = await getPayloadConfig();
  const and: Where[] = [];

  if (filter.category) and.push({ category: { equals: filter.category } });

  if (filter.artist?.trim()) {
    const artists = await payload.find({
      collection: 'artists',
      where: { name: { like: filter.artist.trim() } },
      limit: 100,
      depth: 0,
      select: {},
    });
    and.push({ artist: { in: artists.docs.map((artist) => artist.id) } });
  }

  return payload.find({
    collection: 'artworks',
    locale,
    where: and.length ? { and } : {},
    sort: ['is_sold', '-createdAt'],
    limit: filter.limit ?? 100,
    depth: 1,
  });
};

/** Artworks flagged as featured; falls back to the latest ones when none are. */
export const getFeaturedArtworksQuery = async (locale: Language, limit = 6) => {
  const payload = await getPayloadConfig();
  const featured = await payload.find({
    collection: 'artworks',
    locale,
    where: { featured: { equals: true } },
    sort: '-updatedAt',
    limit,
    depth: 1,
  });
  if (featured.docs.length > 0) return featured.docs;

  const latest = await payload.find({
    collection: 'artworks',
    locale,
    sort: '-createdAt',
    limit,
    depth: 1,
  });
  return latest.docs;
};

export const getAllArtworkImagesQuery = async (locale: Language) => {
  'use cache';
  cacheLife('hours');
  cacheTag(ART_COLLECTION_CACHE_TAG);

  const payload = await getPayloadConfig();
  const artworks = await payload.find({ collection: 'artworks', limit: 100, locale });
  return artworks;
};

export const allArtistsQuery = async (locale: Language, search?: string) => {
  const payload = await getPayloadConfig();
  return payload.find({
    collection: 'artists',
    locale,
    where: search?.trim() ? { name: { like: search.trim() } } : {},
    sort: 'name',
    limit: 100,
    // Only the artist's own photo is needed; their artworks are loaded with
    // getArtworksQuery (images populated) and grouped per artist on the page.
    depth: 1,
  });
};

export const allCuratorsQuery = async (locale: Language) => {
  const payload = await getPayloadConfig();
  return payload.find({ collection: 'curators', locale, sort: 'name', limit: 20, depth: 1 });
};

export const getArtworkByArtistQuery = async (artistId: string, locale: Language) => {
  const payload = await getPayloadConfig();
  return payload.find({
    collection: 'artworks',
    locale,
    where: { artist: { equals: artistId } },
    limit: 100,
    depth: 1,
  });
};

export const getArtworkByCuratorQuery = async (curatorId: string, locale: Language) => {
  'use cache';
  cacheLife('hours');
  cacheTag(ART_COLLECTION_CACHE_TAG);

  const payload = await getPayloadConfig();
  return payload.find({
    collection: 'artworks',
    locale,
    where: { artist: { equals: curatorId } },
    depth: 1,
    limit: 100,
  });
};

const DEFAULT_GALLERY_SETTINGS = {
  vat_rate: 23,
  social_impact_share: '30–40%',
  contact_email: 'artgallery.socialimpact@gmail.com',
  contact_phone: null,
  office_location: null,
};

export type GallerySettings = Pick<
  ArtGallerySetting,
  'vat_rate' | 'social_impact_share' | 'contact_email' | 'contact_phone' | 'office_location'
>;

export const getGallerySettings = async (locale?: Language): Promise<GallerySettings> => {
  try {
    const payload = await getPayloadConfig();
    const settings = await payload.findGlobal({
      slug: ART_GALLERY_SETTINGS_SLUG,
      depth: 0,
      locale,
    });
    return {
      vat_rate: settings.vat_rate ?? DEFAULT_GALLERY_SETTINGS.vat_rate,
      social_impact_share:
        settings.social_impact_share || DEFAULT_GALLERY_SETTINGS.social_impact_share,
      contact_email: settings.contact_email || DEFAULT_GALLERY_SETTINGS.contact_email,
      contact_phone: settings.contact_phone || null,
      office_location: settings.office_location || null,
    };
  } catch (error) {
    Sentry.captureException(error);
    return DEFAULT_GALLERY_SETTINGS;
  }
};

/** Published news flagged "Show in the Art Gallery". */
export const getArtGalleryNewsQuery = async (
  locale: Language,
  opts: { type?: News['type']; limit?: number } = {}
) => {
  const payload = await getPayloadConfig();
  const where: Where = { showInArtGallery: { equals: true }, _status: { equals: 'published' } };
  if (opts.type) where.type = { equals: opts.type };

  return payload.find({
    collection: 'news',
    where,
    locale,
    limit: opts.limit ?? 24,
    sort: '-publishedAt',
    depth: 1,
    draft: false,
  });
};
