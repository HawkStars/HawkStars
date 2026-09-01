import { HawkProject } from '@/payload-types';
import { getPayloadConfig } from '../server';
import { Language } from '@/i18n/settings';
import { findPublishedBySlug } from './helpers';
import { cacheLife, cacheTag } from 'next/cache';
import { HAWK_PROJECT_CACHE_TAG } from '@/payload/collections/HawkProject';
import { connection } from 'next/server';
import { PaginatedDocs } from 'payload';

export type SplitProjectsResult = {
  upcoming: HawkProject[];
};

const PROJECTS_COLLECTION = 'hawk_projects';
const DEFAULT_ARCHIVE_PAGE_LIMIT = 10;

export const getSingleProjectsQuery = async (
  slug: string,
  locale: Language,
  opts?: { preview: boolean }
): Promise<HawkProject | null> =>
  findPublishedBySlug(PROJECTS_COLLECTION, slug, locale, { preview: opts?.preview, depth: 3 });

// The /projects page only ever shows what's upcoming now -- past projects
// live on their own paginated archive at /projects/archive, fetched below by
// getPastProjectsQuery instead of being split out of this same call.
export const getProjectsSplitByDate = async (locale: Language): Promise<SplitProjectsResult> => {
  await connection();
  const payload = await getPayloadConfig();
  const now = new Date().toISOString();

  const upcoming = await payload.find({
    collection: PROJECTS_COLLECTION,
    where: { startDate: { greater_than_equal: now } },
    sort: 'date',
    limit: 100,
    locale,
  });

  return { upcoming: upcoming.docs };
};

// Archive: the /projects/archive page's paginated list of past projects.
export const getPastProjectsQuery = async (
  locale: Language,
  opts?: { page?: number; limit?: number }
): Promise<PaginatedDocs<HawkProject>> => {
  await connection();
  const payload = await getPayloadConfig();
  const now = new Date().toISOString();

  return payload.find({
    collection: PROJECTS_COLLECTION,
    where: { endDate: { less_than: now } },
    sort: '-date',
    limit: opts?.limit ?? DEFAULT_ARCHIVE_PAGE_LIMIT,
    page: opts?.page ?? 1,
    locale,
  });
};
