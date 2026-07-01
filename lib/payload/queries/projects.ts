import { HawkProject } from '@/payload-types';
import { getPayloadConfig } from '../server';
import { Language } from '@/i18n/settings';
import { Where } from 'payload';

export type SplitProjectsResult = {
  upcoming: HawkProject[];
  past: HawkProject[];
};

const PROJECTS_COLLECTION = 'hawk_projects';

export const getSingleProjectsQuery = async (
  slug: string,
  locale: Language,
  opts?: { preview: boolean }
): Promise<HawkProject> => {
  const where = {
    slug: { equals: slug },
    status: { equals: opts?.preview ? null : 'published' },
  } as Where;

  if (opts?.preview) {
    delete where.status;
  }

  const payload = await getPayloadConfig();
  const project = await payload.find({
    collection: PROJECTS_COLLECTION,
    where,
    locale,
    limit: 1,
    depth: 3,
    draft: opts?.preview || false,
  });
  return project.docs[0] ?? null;
};

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
