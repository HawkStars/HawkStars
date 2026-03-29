import { HawkProject } from '@/payload-types';
import { getPayloadConfig } from '../server';
import { PaginatedDocs } from 'payload';
import { Language } from '@/i18n/settings';

const EVENTS_COLLECTION = 'hawk_projects';

export const getSingleEventsQuery = async (
  slug: string,
  locale: Language,
  opts?: { preview: boolean }
): Promise<HawkProject> => {
  const payload = await getPayloadConfig();
  const event = await payload.find({
    collection: EVENTS_COLLECTION,
    where: { slug: { equals: slug } },
    locale,
    limit: 1,
    draft: opts?.preview || false,
  });
  return event.docs[0] ?? null;
};

export const getEventsQuery = async (
  page: number,
  locale: Language
): Promise<PaginatedDocs<HawkProject>> => {
  const payload = await getPayloadConfig();
  const events = await payload.find({
    collection: EVENTS_COLLECTION,
    limit: 10,
    page,
    sort: '-date',
    locale,
  });

  return events;
};

export type SplitProjectsResult = {
  upcoming: HawkProject[];
  past: HawkProject[];
};

export const getProjectsSplitByDate = async (locale: Language): Promise<SplitProjectsResult> => {
  const payload = await getPayloadConfig();
  const now = new Date().toISOString();

  const [upcomingResult, pastResult] = await Promise.all([
    payload.find({
      collection: EVENTS_COLLECTION,
      where: { date: { greater_than_equal: now } },
      sort: 'date',
      limit: 100,
      locale,
    }),
    payload.find({
      collection: EVENTS_COLLECTION,
      where: { date: { less_than: now } },
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
