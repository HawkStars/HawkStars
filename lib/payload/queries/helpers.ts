import 'server-only';

import type {
  CollectionSlug,
  DataFromCollectionSlug,
  DataFromGlobalSlug,
  GlobalSlug,
  Where,
} from 'payload';

import { Language } from '@/i18n/settings';
import { getPayloadConfig } from '../server';
import { cacheLife, cacheTag } from 'next/cache';

type SlugQueryOptions = {
  preview?: boolean;
  depth?: number;
};

const findBySlug = async <TSlug extends CollectionSlug>(
  collection: TSlug,
  slug: string,
  locale: Language,
  opts?: SlugQueryOptions
): Promise<DataFromCollectionSlug<TSlug> | null> => {
  const where: Where = { slug: { equals: slug } };

  const payload = await getPayloadConfig();
  const result = await payload.find({
    collection,
    where,
    locale,
    limit: 1,
    depth: opts?.depth,
    draft: opts?.preview ?? false,
  });

  return result.docs[0] ?? null;
};

const findPublishedCached = async <TSlug extends CollectionSlug>(
  collection: TSlug,
  slug: string,
  locale: Language,
  depth?: number
) => {
  'use cache';
  cacheLife('hours');
  cacheTag(`${collection}:${slug}`, `${collection}`);
  return findBySlug(collection, slug, locale, { depth, preview: false });
};

export const findPublishedBySlug = async <TSlug extends CollectionSlug>(
  collection: TSlug,
  slug: string,
  locale: Language,
  opts?: SlugQueryOptions
) =>
  opts?.preview
    ? findBySlug(collection, slug, locale, opts) // drafts: never cached
    : findPublishedCached(collection, slug, locale, opts?.depth);

/**
 * Read a localized global with the common depth + preview handling shared by the
 * `*-list` header globals and settings globals.
 */
export const findGlobalLocalized = async <TSlug extends GlobalSlug>(
  slug: TSlug,
  locale: Language,
  opts?: { depth?: number; preview?: boolean }
): Promise<DataFromGlobalSlug<TSlug>> => {
  'use cache';
  const payload = await getPayloadConfig();
  return payload.findGlobal({
    slug,
    locale,
    depth: opts?.depth ?? 1,
    draft: opts?.preview ?? false,
  });
};
