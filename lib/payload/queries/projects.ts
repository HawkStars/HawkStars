import { HawkProject } from '@/payload-types';
import { getPayloadConfig } from '../server';
import { Language } from '@/i18n/settings';
import { findPublishedBySlug } from './helpers';
import { cacheLife, cacheTag } from 'next/cache';
import { HAWK_PROJECT_CACHE_TAG } from '@/payload/collections/HawkProject';
import { connection } from 'next/server';
import { PaginatedDocs, Where } from 'payload';

export type SplitProjectsResult = {
  upcoming: HawkProject[];
};

type ProjectFilterOpts = {
  type?: HawkProject['project_type'];
  year?: number;
};

const PROJECTS_COLLECTION = 'hawk_projects';
const DEFAULT_ARCHIVE_PAGE_LIMIT = 10;

export const getSingleProjectsQuery = async (
  slug: string,
  locale: Language,
  opts?: { preview: boolean }
): Promise<HawkProject | null> =>
  findPublishedBySlug(PROJECTS_COLLECTION, slug, locale, { preview: opts?.preview, depth: 3 });

// project_type/year filters build on top of the date-bucket condition rather
// than replacing it, so a type/year pick on /projects still only ever shows
// upcoming projects, and on /projects/archive only past ones.
const buildProjectFilterConditions = (
  opts: ProjectFilterOpts,
  dateField: 'startDate' | 'endDate'
): Where[] => {
  const conditions: Where[] = [];
  if (opts.type) conditions.push({ project_type: { equals: opts.type } });
  if (opts.year) {
    conditions.push({ [dateField]: { greater_than_equal: `${opts.year}-01-01` } });
    conditions.push({ [dateField]: { less_than: `${opts.year + 1}-01-01` } });
  }
  return conditions;
};

// The /projects page only ever shows what's upcoming now -- past projects
// live on their own paginated archive at /projects/archive, fetched below by
// getPastProjectsQuery instead of being split out of this same call.
export const getProjectsSplitByDate = async (
  locale: Language,
  opts?: ProjectFilterOpts
): Promise<SplitProjectsResult> => {
  await connection();
  const payload = await getPayloadConfig();
  const now = new Date().toISOString();

  const conditions: Where[] = [
    { startDate: { greater_than_equal: now } },
    ...buildProjectFilterConditions(opts ?? {}, 'startDate'),
  ];

  const upcoming = await payload.find({
    collection: PROJECTS_COLLECTION,
    where: conditions.length > 1 ? { and: conditions } : conditions[0],
    sort: 'date',
    limit: 100,
    locale,
  });

  return { upcoming: upcoming.docs };
};

// Archive: the /projects/archive page's paginated list of past projects.
export const getPastProjectsQuery = async (
  locale: Language,
  opts?: { page?: number; limit?: number } & ProjectFilterOpts
): Promise<PaginatedDocs<HawkProject>> => {
  await connection();
  const payload = await getPayloadConfig();
  const now = new Date().toISOString();

  const conditions: Where[] = [
    { endDate: { less_than: now } },
    ...buildProjectFilterConditions(opts ?? {}, 'endDate'),
  ];

  return payload.find({
    collection: PROJECTS_COLLECTION,
    where: conditions.length > 1 ? { and: conditions } : conditions[0],
    sort: '-date',
    limit: opts?.limit ?? DEFAULT_ARCHIVE_PAGE_LIMIT,
    page: opts?.page ?? 1,
    locale,
  });
};

// Distinct years across every project (there's no dedicated "year" field),
// used to populate the year filter's option list. A lightweight,
// fields-only query rather than a hardcoded/guessed range.
export const getProjectYearsQuery = async (locale: Language): Promise<number[]> => {
  const payload = await getPayloadConfig();
  const result = await payload.find({
    collection: PROJECTS_COLLECTION,
    locale,
    limit: 0,
    select: { startDate: true },
  });

  const years = new Set<number>();
  for (const doc of result.docs) {
    if (doc.startDate) years.add(new Date(doc.startDate).getFullYear());
  }
  return Array.from(years).sort((a, b) => b - a);
};
