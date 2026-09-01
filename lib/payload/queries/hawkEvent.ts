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

// The /events page only shows what's happening now and what's upcoming --
// past events live on their own paginated archive at /events/archive,
// fetched separately via the exported getPastEvents below instead of being
// split out of this same call.
const getHawkEventsSplitByDate = async (
  locale: Language,
  opts: { preview?: boolean } = {}
): Promise<SplitHawkEventsResult> => {
  // 'use cache';
  // cacheLife('hours');
  // cacheTag(HAWK_EVENT_CACHE_TAG);

  const { preview = false } = opts;

  const [upcomingResult, current] = await Promise.all([
    getUpcomingEvents(locale, { preview }),
    getCurrentEvents(locale, { preview }),
  ]);

  return { upcoming: upcomingResult.docs, current };
};

const getCurrentEvents = async (
  locale: Language,
  opts: { preview: boolean } = { preview: false }
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
    where: { or: [dayHappening, inBetweenRangeDates] },
    sort: 'date',
    limit: 100,
    locale,
    draft: opts.preview || false,
  });
};

const getUpcomingEvents = async (
  locale: Language,
  opts: { preview?: boolean; page?: number; limit?: number } = {}
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
    where: { or: [greaterThanToday, greaterThanTodayRange] },
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
  opts: { preview?: boolean; page?: number; limit?: number } = {}
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
    where: { or: [beforeToday, beforeTodayRange] },
    sort: '-date',
    limit: opts.limit ?? 10,
    page: opts.page ?? 1,
    locale,
    draft: opts.preview || false,
  });
};

export {
  getCurrentEvents,
  getPastEvents,
  getSingleHawkEventQuery,
  getHawkEventsSplitByDate,
  type SplitHawkEventsResult,
};
