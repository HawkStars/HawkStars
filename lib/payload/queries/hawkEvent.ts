import { getPayloadConfig } from '../server';
import { Language } from '@/i18n/settings';
import { findPublishedBySlug } from './helpers';

const EVENTS_COLLECTION = 'hawk_events' as const;

/**
 * The event pages access fields that predate the generated `HawkEvent` type, so
 * this stays a loose alias to avoid surfacing unrelated type debt here.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HawkEventDoc = Record<string, any>;

export const getSingleHawkEventQuery = async (
  slug: string,
  locale: Language,
  opts: { preview: boolean } = { preview: false }
): Promise<HawkEventDoc | null> => {
  const doc = await findPublishedBySlug(EVENTS_COLLECTION, slug, locale, {
    preview: opts?.preview,
    depth: 2,
  });
  return doc as HawkEventDoc | null;
};

export type SplitHawkEventsResult = {
  upcoming: HawkEventDoc[];
  past: HawkEventDoc[];
};

export const getHawkEventsSplitByDate = async (
  locale: Language,
  opts: { preview: boolean } = { preview: false }
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
      draft: opts.preview || false,
    }),
    payload.find({
      collection: EVENTS_COLLECTION,
      where: { date: { less_than: now } },
      sort: '-date',
      limit: 100,
      locale,
      draft: opts.preview || false,
    }),
  ]);

  return {
    upcoming: upcomingResult.docs,
    past: pastResult.docs,
  };
};
