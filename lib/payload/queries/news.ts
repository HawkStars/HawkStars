import { Language } from '@/i18n/settings';
import { getPayloadConfig } from '../server';
import { News, HawkProject } from '@/payload-types';
import { PaginatedDocs, Where } from 'payload';

const NEWS_COLLECTION = 'news';

export const getSingleNewsSlug = async (
  slug: string,
  locale: Language,
  opts?: { preview: boolean }
): Promise<News | null> => {
  const payload = await getPayloadConfig();
  const news = await payload.find({
    collection: NEWS_COLLECTION,
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    locale,
    limit: 1,
    draft: opts?.preview || false,
  });
  return news ? news.docs[0] : null;
};

export const getNewsQuery = async (
  page: number,
  locale: Language,
  projectSlug?: string
): Promise<PaginatedDocs<News>> => {
  const payload = await getPayloadConfig();

  const where: Where = { status: { equals: 'published' } };

  if (projectSlug) {
    // Resolve project ID from slug, then filter news by that project
    const project = await payload.find({
      collection: 'hawk_projects',
      where: { slug: { equals: projectSlug } },
      limit: 1,
      depth: 0,
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
 */
export const getNewsByProjectId = async (
  projectId: string,
  locale: Language,
  limit = 6
): Promise<News[]> => {
  const payload = await getPayloadConfig();
  const result = await payload.find({
    collection: NEWS_COLLECTION,
    where: {
      status: { equals: 'published' },
      project: { equals: projectId },
    },
    locale,
    limit,
    sort: '-publishedAt',
    depth: 1,
  });
  return result.docs;
};

/**
 * Get all published projects (id + heading + slug) for use in filter dropdowns.
 */
export const getProjectsForNewsFilter = async (
  locale: Language
): Promise<Pick<HawkProject, 'id' | 'heading' | 'slug'>[]> => {
  const payload = await getPayloadConfig();
  const result = await payload.find({
    collection: 'hawk_projects',
    where: { status: { equals: 'published' } },
    locale,
    limit: 100,
    sort: '-startDate',
    depth: 0,
  });
  return result.docs.map((p) => ({ id: p.id, heading: p.heading, slug: p.slug }));
};
