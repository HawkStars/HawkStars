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

/**
 * The only collections with `versions.drafts` enabled, and therefore the only ones
 * whose documents carry a `_status` field. Keep in sync with the `versions` key on
 * Pages, News and HawkProject — filtering `_status` anywhere else silently returns
 * nothing.
 */
const DRAFT_COLLECTIONS = new Set<string>(['pages', 'news', 'hawk_projects']);

export const hasDrafts = (collection: string) => DRAFT_COLLECTIONS.has(collection);

const findBySlug = async <TSlug extends CollectionSlug>(
  collection: TSlug,
  slug: string,
  locale: Language,
  opts?: SlugQueryOptions
): Promise<DataFromCollectionSlug<TSlug> | null> => {
  // `draft: false` below does not filter on `_status` — it only stops Payload merging
  // the newest draft version over the top. Without this clause an unpublished document
  // renders at its public URL. The preview routes are auth-gated and opt out.
  //
  // Only applied to collections that actually enable `versions.drafts`. On a collection
  // without them there is no `_status` field, and the clause matches nothing — which is
  // the bug app/sitemap.ts documents having already dropped every artwork, curator and
  // event from the sitemap once.
  const where: Where =
    opts?.preview || !hasDrafts(collection)
      ? { slug: { equals: slug } }
      : { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] };

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

const findGlobalBySlug = async <TSlug extends GlobalSlug>(
  slug: TSlug,
  locale: Language,
  opts: SlugQueryOptions
): Promise<DataFromGlobalSlug<TSlug> | null> => {
  const payload = await getPayloadConfig();
  return payload.findGlobal({
    slug,
    locale,
    depth: opts?.depth ?? 1,
    draft: opts?.preview ?? false,
  });
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

export const findGlobalCached = async <TSlug extends GlobalSlug>(
  slug: TSlug,
  locale: Language,
  depth?: number
) => {
  'use cache';
  cacheLife('hours');
  cacheTag(`global:${slug}`);
  return findGlobalBySlug(slug, locale, { depth, preview: false });
};

/**
 *
 * @param collection - Collection Slug from Payload
 * @param slug - slug of the collection
 * @param locale - i18n of the collection
 * @param opts - options. depth and preview (optional)
 * @returns Returns information of a collection from payload
 */
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
 *
 * @param slug - slug of the globals
 * @param locale - i18n of the globals
 * @param opts - options. depth and preview (optional)
 * @returns Returns information of a global from payload
 */
export const findGlobalLocalized = async <TSlug extends GlobalSlug>(
  slug: TSlug,
  locale: Language,
  opts?: { depth?: number; preview?: boolean }
): Promise<DataFromGlobalSlug<TSlug> | null> =>
  opts?.preview
    ? findGlobalBySlug(slug, locale, opts)
    : findGlobalCached(slug, locale, opts?.depth);
