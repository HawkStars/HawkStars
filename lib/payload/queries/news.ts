import { Language } from '@/i18n/settings';
import { getPayloadConfig } from '../server';
import { News } from '@/payload-types';
import { PaginatedDocs, Where } from 'payload';
import { findPublishedBySlug } from './helpers';
import { PayloadQueryParams } from '../types';
import { cacheLife, cacheTag } from 'next/cache';
import { NEWS_CACHE_TAG } from '@/payload/collections/News';
import { HAWK_PROJECT_CACHE_TAG } from '@/payload/collections/HawkProject';

const NEWS_COLLECTION = 'news';

export const getSingleNewsSlug = async (
  slug: string,
  locale: Language,
  opts?: { preview: boolean }
): Promise<News | null> =>
  findPublishedBySlug(NEWS_COLLECTION, slug, locale, { preview: opts?.preview });

export const getNewsQuery = async (
  locale: Language,
  opts?: PayloadQueryParams & { type?: News['type'] }
): Promise<PaginatedDocs<News>> => {
  'use cache';
  cacheLife('hours');
  // Tagged for both collections because the `projectSlug` branch below reads
  // `hawk_projects` as well — renaming a project's slug has to invalidate this
  // entry, not just publishing a news article.
  cacheTag(NEWS_CACHE_TAG, HAWK_PROJECT_CACHE_TAG);

  const { page, limit, type } = opts || { page: 1, limit: 10 };
  const payload = await getPayloadConfig();

  // Local API calls bypass access control, so the `_status` filter has to be repeated
  // here — `draft: false` alone does not exclude documents whose own status is draft.
  const conditions: Where[] = [{ _status: { equals: 'published' } }];
  if (type) conditions.push({ type: { equals: type } });

  const where: Where = { and: conditions };

  return await payload.find({
    collection: NEWS_COLLECTION,
    where,
    locale,
    limit: limit ?? 10,
    page: page ?? 1,
    sort: '-publishedAt',
    depth: 1,
  });
};
