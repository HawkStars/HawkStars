import type {
  AgendaBlock,
  HawkEvent,
  HawkProject,
  LatestNewsBlock,
  News,
  UpcomingHawkEventBlock,
} from '@/payload-types';
import type { Where } from 'payload';
import { cacheLife, cacheTag } from 'next/cache';
import { getPayloadConfig } from '../server';
import { Language } from '@/i18n/settings';
import { currentTimeBucket } from '@/lib/utils/date';
import { HAWK_EVENT_CACHE_TAG } from '@/payload/collections/HawkEvent';
import { HAWK_PROJECT_CACHE_TAG } from '@/payload/collections/HawkProject';
import { NEWS_CACHE_TAG } from '@/payload/collections/News';

/**
 * Server-side replacements for `lib/payload/client-side/queries/*`, which the
 * page-builder blocks used to call from a `useEffect` after hydration.
 *
 * Each of those cost an extra browser round trip and an uncached Mongo read at
 * REST's default depth 2, rendered `null` until it resolved (so crawlers saw an empty
 * section and users saw a layout shift), and passed no `locale` — so English pages
 * were served Portuguese content.
 */

const published: Where = { _status: { equals: 'published' } };

/** UpcomingHawkEventBlock: the single next upcoming event. */
export const getUpcomingEventForBlock = async (
  locale: Language,
  eventType: UpcomingHawkEventBlock['eventType']
): Promise<HawkEvent | null> => getUpcomingEventAt(locale, currentTimeBucket(), eventType);

const getUpcomingEventAt = async (
  locale: Language,
  now: string,
  eventType: UpcomingHawkEventBlock['eventType']
): Promise<HawkEvent | null> => {
  'use cache';
  cacheLife('hours');
  cacheTag(HAWK_EVENT_CACHE_TAG);

  const conditions: Where[] = [{ date: { greater_than_equal: now } }];
  if (eventType && eventType.length > 0) conditions.push({ type_event: { in: eventType } });

  const payload = await getPayloadConfig();
  const result = await payload.find({
    collection: 'hawk_events',
    where: { and: conditions },
    sort: 'date',
    limit: 1,
    depth: 1,
    locale,
  });

  return result.docs[0] ?? null;
};

/** LatestNewsBlock, `source: 'news'`. */
export const getLatestNewsForBlock = async (
  locale: Language,
  newsType: LatestNewsBlock['newsType']
): Promise<News | null> => {
  'use cache';
  cacheLife('hours');
  cacheTag(NEWS_CACHE_TAG);

  const conditions: Where[] = [published];
  if (newsType && newsType.length > 0) conditions.push({ type: { in: newsType } });

  const payload = await getPayloadConfig();
  const result = await payload.find({
    collection: 'news',
    where: { and: conditions },
    sort: '-publishedAt',
    limit: 1,
    depth: 1,
    locale,
  });

  return result.docs[0] ?? null;
};

/** LatestNewsBlock, `source: 'hawk_projects'`. */
export const getLatestEventForBlock = async (
  locale: Language,
  eventType: LatestNewsBlock['eventType']
): Promise<HawkEvent | null> => {
  'use cache';
  cacheLife('hours');
  cacheTag(HAWK_EVENT_CACHE_TAG);

  const conditions: Where[] = [];
  if (eventType && eventType.length > 0) conditions.push({ type_event: { in: eventType } });

  const payload = await getPayloadConfig();
  const result = await payload.find({
    collection: 'hawk_events',
    where: conditions.length > 0 ? { and: conditions } : {},
    sort: '-date',
    limit: 1,
    depth: 1,
    locale,
  });

  return result.docs[0] ?? null;
};

/** AgendaBlock: upcoming events and projects, merged by the caller. */
export const getAgendaForBlock = async (
  locale: Language,
  eventType: AgendaBlock['eventType'],
  maxEvents: AgendaBlock['maxEvents']
): Promise<{ events: HawkEvent[]; projects: HawkProject[] }> =>
  getAgendaAt(locale, currentTimeBucket(), eventType, maxEvents);

const getAgendaAt = async (
  locale: Language,
  now: string,
  eventType: AgendaBlock['eventType'],
  maxEvents: AgendaBlock['maxEvents']
): Promise<{ events: HawkEvent[]; projects: HawkProject[] }> => {
  'use cache';
  cacheLife('hours');
  cacheTag(HAWK_EVENT_CACHE_TAG, HAWK_PROJECT_CACHE_TAG);

  const limit = maxEvents ?? 20;
  const eventConditions: Where[] = [{ date: { greater_than_equal: now } }];
  if (eventType && eventType.length > 0) eventConditions.push({ type_event: { in: eventType } });

  const payload = await getPayloadConfig();
  const [events, projects] = await Promise.all([
    payload.find({
      collection: 'hawk_events',
      where: { and: eventConditions },
      sort: 'date',
      limit,
      depth: 1,
      locale,
    }),
    payload.find({
      collection: 'hawk_projects',
      where: { and: [published, { startDate: { greater_than_equal: now } }] },
      sort: 'startDate',
      limit,
      // depth 1 is enough for the cover image; REST was returning the whole
      // page-tab/partners/itinerary tree at depth 2.
      depth: 1,
      locale,
    }),
  ]);

  return { events: events.docs, projects: projects.docs };
};
