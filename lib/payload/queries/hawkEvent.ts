import { getPayloadConfig } from '../server';
import { Language } from '@/i18n/settings';
import { findPublishedBySlug } from './helpers';
import { HawkEvent } from '@/payload-types';
import { PaginatedDocs, Where } from 'payload';
import { customDateRangeQuery } from '@/lib/utils/date';
// import { cacheLife, cacheTag } from 'next/cache';
// import { HAWK_EVENT_CACHE_TAG } from '@/payload/collections/HawkEvent';

const EVENTS_COLLECTION = 'hawk_events' as const;

const getSingleHawkEventQuery = async (
  slug: string,
  locale: Language,
  opts: { preview: boolean } = { preview: false }
): Promise<HawkEvent | null> => {
  const doc = await findPublishedBySlug(EVENTS_COLLECTION, slug, locale, {
    preview: opts?.preview,
    depth: 2,
  });
  return doc as HawkEvent | null;
};

type SplitHawkEventsResult = {
  upcoming: HawkEvent[];
  current: PaginatedDocs<HawkEvent>;
};

type HawkEventFilterOpts = {
  type?: HawkEvent['type_event'];
  year?: number;
};

// Shared by getCurrentEvents/getUpcomingEvents/getPastEvents: folds an
// optional type_event/year pick into each date bucket's own `where`, so a
// filter selected on the page applies consistently across whichever of
// current/upcoming/past that bucket represents.
const withEventFilters = (dateWhere: Where, opts: HawkEventFilterOpts): Where => {
  const extra: Where[] = [];
  if (opts.type) extra.push({ type_event: { equals: opts.type } });
  if (opts.year) {
    extra.push({ date: { greater_than_equal: `${opts.year}-01-01` } });
    extra.push({ date: { less_than: `${opts.year + 1}-01-01` } });
  }
  return extra.length > 0 ? { and: [dateWhere, ...extra] } : dateWhere;
};

// The /events page only shows what's happening now and what's upcoming --
// past events live on their own paginated archive at /events/archive,
// fetched separately via the exported getPastEvents below instead of being
// split out of this same call.
const getHawkEventsSplitByDate = async (
  locale: Language,
  opts: { preview?: boolean } & HawkEventFilterOpts = {}
): Promise<SplitHawkEventsResult> => {
  // 'use cache';
  // cacheLife('hours');
  // cacheTag(HAWK_EVENT_CACHE_TAG);

  const { preview = false, type, year } = opts;

  const [upcomingResult, current] = await Promise.all([
    getUpcomingEvents(locale, { preview, type, year }),
    getCurrentEvents(locale, { preview, type, year }),
  ]);

  return { upcoming: upcomingResult.docs, current };
};

const getCurrentEvents = async (
  locale: Language,
  opts: { preview?: boolean } & HawkEventFilterOpts = {}
) => {
  const payload = await getPayloadConfig();
  const { startOfDay, endOfDay, now } = customDateRangeQuery();

  const dayHappening: Where = {
    and: [
      { isDateRange: { equals: false } },
      { date: { greater_than_equal: startOfDay.toISOString() } },
      { date: { less_than_equal: endOfDay.toISOString() } },
    ],
  };

  const inBetweenRangeDates: Where = {
    and: [
      { isDateRange: { equals: true } },
      { date: { less_than_equal: now } },
      { endDate: { greater_than_equal: now } },
    ],
  };

  return payload.find({
    collection: EVENTS_COLLECTION,
    where: withEventFilters({ or: [dayHappening, inBetweenRangeDates] }, opts),
    sort: 'date',
    limit: 100,
    locale,
    draft: opts.preview || false,
  });
};

const getUpcomingEvents = async (
  locale: Language,
  opts: { preview?: boolean; page?: number; limit?: number } & HawkEventFilterOpts = {}
) => {
  const payload = await getPayloadConfig();
  const { endOfDay } = customDateRangeQuery();

  const greaterThanToday: Where = {
    and: [{ isDateRange: { equals: false } }, { date: { greater_than: endOfDay.toISOString() } }],
  };

  const greaterThanTodayRange: Where = {
    and: [
      { isDateRange: { equals: true } },
      { date: { greater_than: endOfDay.toDateString() } },
      { endDate: { greater_than: endOfDay.toDateString() } },
    ],
  };

  return payload.find({
    collection: EVENTS_COLLECTION,
    where: withEventFilters({ or: [greaterThanToday, greaterThanTodayRange] }, opts),
    sort: 'date',
    limit: opts.limit ?? 100,
    page: opts.page ?? 1,
    locale,
    draft: opts.preview || false,
  });
};

// Archive: the /events/archive page's paginated list of past events. This is
// the only remaining caller now that /events itself doesn't paginate past
// events, hence the smaller default page size (matches getPastProjectsQuery).
const getPastEvents = async (
  locale: Language,
  opts: { preview?: boolean; page?: number; limit?: number } & HawkEventFilterOpts = {}
) => {
  const payload = await getPayloadConfig();
  const { startOfDay } = customDateRangeQuery();

  const beforeToday: Where = {
    and: [{ isDateRange: { equals: false } }, { date: { less_than: startOfDay.toISOString() } }],
  };

  const beforeTodayRange: Where = {
    and: [
      { isDateRange: { equals: true } },
      { date: { less_than: startOfDay.toDateString() } },
      { endDate: { less_than: startOfDay.toDateString() } },
    ],
  };

  return payload.find({
    collection: EVENTS_COLLECTION,
    where: withEventFilters({ or: [beforeToday, beforeTodayRange] }, opts),
    sort: '-date',
    limit: opts.limit ?? 10,
    page: opts.page ?? 1,
    locale,
    draft: opts.preview || false,
  });
};

// Distinct years across every event (there's no dedicated "year" field),
// used to populate the year filter's option list.
export const getEventYearsQuery = async (locale: Language): Promise<number[]> => {
  const payload = await getPayloadConfig();
  const result = await payload.find({
    collection: EVENTS_COLLECTION,
    locale,
    limit: 0,
    select: { date: true },
  });

  const years = new Set<number>();
  for (const doc of result.docs) {
    if (doc.date) years.add(new Date(doc.date).getFullYear());
  }
  return Array.from(years).sort((a, b) => b - a);
};

export {
  getCurrentEvents,
  getPastEvents,
  getSingleHawkEventQuery,
  getHawkEventsSplitByDate,
  type SplitHawkEventsResult,
};
