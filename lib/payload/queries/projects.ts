import { HawkProject } from '@/payload-types';
import { getPayloadConfig } from '../server';
import { Language } from '@/i18n/settings';
import { findPublishedBySlug } from './helpers';
import { cacheLife, cacheTag } from 'next/cache';
import { HAWK_PROJECT_CACHE_TAG } from '@/payload/collections/HawkProject';

export type SplitProjectsResult = {
  upcoming: HawkProject[];
  past: HawkProject[];
};

const PROJECTS_COLLECTION = 'hawk_projects';

export const getSingleProjectsQuery = async (
  slug: string,
  locale: Language,
  opts?: { preview: boolean }
): Promise<HawkProject | null> =>
  findPublishedBySlug(PROJECTS_COLLECTION, slug, locale, { preview: opts?.preview, depth: 3 });

export const getProjectsSplitByDate = async (locale: Language): Promise<SplitProjectsResult> => {
  const payload = await getPayloadConfig();
  const now = new Date().toISOString();

  const [upcomingResult, pastResult] = await Promise.all([
    payload.find({
      collection: PROJECTS_COLLECTION,
      where: { startDate: { greater_than_equal: now } },
      sort: 'date',
      limit: 100,
      locale,
    }),
    payload.find({
      collection: PROJECTS_COLLECTION,
      where: { endDate: { less_than: now } },
      sort: '-date',
      limit: 100,
      locale,
    }),
  ]);

  return {
    upcoming: upcomingResult.docs,
    past: pastResult.docs,
  };
};
