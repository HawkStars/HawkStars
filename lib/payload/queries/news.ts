import { Language } from '@/i18n/settings';
import { getPayloadConfig } from '../server';
import { News } from '@/payload-types';
import { PaginatedDocs, Where } from 'payload';
import { findPublishedBySlug } from './helpers';
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
  page: number,
  locale: Language,
  projectSlug?: string
): Promise<PaginatedDocs<News>> => {
  'use cache';
  cacheLife('hours');
  // Tagged for both collections because the `projectSlug` branch below reads
  // `hawk_projects` as well — renaming a project's slug has to invalidate this
  // entry, not just publishing a news article.
  cacheTag(NEWS_CACHE_TAG, HAWK_PROJECT_CACHE_TAG);

  const payload = await getPayloadConfig();

  const where: Where = {};

  if (projectSlug) {
    // Resolve project ID from slug, then filter news by that project
    const project = await payload.find({
      collection: 'hawk_projects',
      where: { slug: { equals: projectSlug } },
      limit: 1,
      depth: 0,
      draft: false,
    });
    const projectId = project.docs[0]?.id;
    if (projectId) {
      where.project = { equals: projectId };
    }
  }

  return await payload.find({
    collection: NEWS_COLLECTION,
    where,
    locale,
    limit: 9,
    page,
    sort: '-publishedAt',
    depth: 1,
  });
};

/**
 * Get news articles linked to a specific project (by project ID).
 * Used on project detail pages to show a "Related News" section.
 * Check where this can be added.
 */
export const getNewsByProjectId = async (
  projectId: string,
  locale: Language,
  limit = 6
): Promise<News[]> => {
  'use cache';
  cacheLife('hours');
  cacheTag(NEWS_CACHE_TAG);

  const payload = await getPayloadConfig();
  const result = await payload.find({
    collection: NEWS_COLLECTION,
    where: {
      project: { equals: projectId },
    },
    draft: false,
    locale,
    limit,
    sort: '-publishedAt',
    depth: 1,
  });
  return result.docs;
};
