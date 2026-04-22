import { getPayloadConfig } from '../server';
import { PaginatedDocs } from 'payload';
import { Language } from '@/i18n/settings';

const EVENTS_COLLECTION = 'hawk_events' as const;

/**
 * NOTE: Run `pnpm payload generate:types` to generate the HawkEvent type.
 * Until then we use a loose type alias so the rest of the scaffold compiles.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HawkEventDoc = Record<string, any>;

export const getSingleHawkEventQuery = async (
  slug: string,
  locale: Language,
  opts?: { preview: boolean }
): Promise<HawkEventDoc | null> => {
  const payload = await getPayloadConfig();
  const result = await payload.find({
    collection: EVENTS_COLLECTION,
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    locale,
    limit: 1,
    depth: 2,
    draft: opts?.preview || false,
  });
  return result.docs[0] ?? null;
};

export const getHawkEventsQuery = async (
  page: number,
  locale: Language
): Promise<PaginatedDocs<HawkEventDoc>> => {
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

export type SplitHawkEventsResult = {
  upcoming: HawkEventDoc[];
  past: HawkEventDoc[];
};

export const getHawkEventsSplitByDate = async (
  locale: Language
): Promise<SplitHawkEventsResult> => {
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
