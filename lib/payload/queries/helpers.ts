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

type SlugQueryOptions = {
  preview?: boolean;
  depth?: number;
};

/**
 * Find a single published document in `collection` matching `slug`.
 *
 * Consolidates the repeated "find one published doc by slug + preview handling"
 * boilerplate that previously lived in news / pages / hawk_events / hawk_projects
 * query files.
 */
export const findPublishedBySlug = async <TSlug extends CollectionSlug>(
  collection: TSlug,
  slug: string,
  locale: Language,
  opts?: SlugQueryOptions
): Promise<DataFromCollectionSlug<TSlug> | null> => {
  const where: Where = { slug: { equals: slug } };
  if (!opts?.preview) {
    where.status = { equals: 'published' };
  }

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

/**
 * Read a localized global with the common depth + preview handling shared by the
 * `*-list` header globals and settings globals.
 */
export const findGlobalLocalized = async <TSlug extends GlobalSlug>(
  slug: TSlug,
  locale: Language,
  opts?: { depth?: number; preview?: boolean }
): Promise<DataFromGlobalSlug<TSlug>> => {
  const payload = await getPayloadConfig();
  return payload.findGlobal({
    slug,
    locale,
    depth: opts?.depth ?? 1,
    draft: opts?.preview ?? false,
  });
};
