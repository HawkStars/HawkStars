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
  past: HawkEvent[];
  current: PaginatedDocs<HawkEvent>;
};

const getHawkEventsSplitByDate = async (
  locale: Language,
  opts: { preview: boolean } = { preview: false }
): Promise<SplitHawkEventsResult> => {
  // 'use cache';
  // cacheLife('hours');
  // cacheTag(HAWK_EVENT_CACHE_TAG);

  const [upcomingResult, pastResult, currentEvents] = await Promise.all([
    getUpcomingEvents(locale, opts),
    getPastEvents(locale, opts),
    getCurrentEvents(locale, opts),
  ]);

  return {
    upcoming: upcomingResult.docs,
    past: pastResult.docs,
    current: currentEvents,
  };
};

const getCurrentEvents = async (
  locale: Language,
  opts: { preview: boolean } = { preview: false }
) => {
  const payload = await getPayloadConfig();
  const { startOfDay, endOfDay } = customDateRangeQuery();

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
      { date: { greater_than_equal: startOfDay.toISOString() } },
      { endDate: { less_than_equal: endOfDay.toISOString() } },
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
  opts: { preview: boolean } = { preview: false }
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
    limit: 100,
    locale,
    draft: opts.preview || false,
  });
};

const getPastEvents = async (locale: Language, opts: { preview: boolean } = { preview: false }) => {
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
    limit: 100,
    locale,
    draft: opts.preview || false,
  });
};

export {
  getCurrentEvents,
  getSingleHawkEventQuery,
  getHawkEventsSplitByDate,
  type SplitHawkEventsResult,
};
