import type { AgendaBlock, HawkEvent } from '@/payload-types';
import type { Where } from 'payload';
import { stringify } from 'qs-esm';

import API_CLIENT_PATHS from '../constants';
import { Language } from '@/i18n/settings';
import payloadClientQuery from '../client';

type FetchEventOptions = {
  controller: AbortController;
  eventType?: ('local_event' | 'international_event' | 'other')[] | null | undefined;
};

const fetchEvent = async ({ controller, eventType }: FetchEventOptions) => {
  const where: Where = {};
  if (eventType && eventType.length > 0) where.type_event = { in: eventType };

  const query = stringify({ where, limit: 1 }, { addQueryPrefix: true });

  return await payloadClientQuery<HawkEvent | null>({
    url: API_CLIENT_PATHS.projects,
    query,
    method: 'GET',
    fallback: null,
    controller,
    singleValue: true,
  });
};

// --- AgendaBlock ---

type FetchAgendaEventsOptions = {
  eventType?: AgendaBlock['eventType'];
  maxEvents?: AgendaBlock['maxEvents'];
};

/**
 * Fetch upcoming hawk events for the AgendaBlock.
 *
 * NOTE: previously this fetched from /api/hawk_projects — it now correctly
 * targets /api/hawk_events, which holds the date/type_event fields being filtered.
 */
const fetchAgendaEvents = async ({ eventType, maxEvents }: FetchAgendaEventsOptions) => {
  const today = new Date().toISOString();
  const limit = maxEvents && maxEvents > 0 ? Math.min(maxEvents, 20) : 5;

  const dateFilter: Where = {
    or: [{ date: { greater_than_equal: today } }, { endDate: { greater_than_equal: today } }],
  };

  const where: Where =
    eventType && eventType.length > 0
      ? { and: [dateFilter, { type_event: { in: eventType } }] }
      : dateFilter;

  const query = stringify({ where, limit, sort: 'date' }, { addQueryPrefix: true });

  return await payloadClientQuery<HawkEvent[]>({
    url: API_CLIENT_PATHS.events,
    query,
    method: 'GET',
    fallback: [],
  });
};

const getEventsByMonthAndYear = async (
  locale: Language,
  month: number,
  year: number
): Promise<HawkEvent[]> => {
  // Current calendar month: from the 1st (00:00) to the last day (23:59:59).
  const startOfMonth = new Date(year, month, 1, 0, 0, 0, 0);
  const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

  const where: Where = {
    // Include any event that overlaps the current month — either it starts
    // within the month, or it's a multi-day event still running into it.
    or: [
      {
        date: {
          greater_than_equal: startOfMonth.toISOString(),
          less_than_equal: endOfMonth.toISOString(),
        },
      },
      {
        and: [
          { date: { less_than: startOfMonth.toISOString() } },
          { endDate: { greater_than_equal: startOfMonth.toISOString() } },
        ],
      },
    ],
  };

  const query = stringify({ where, locale, sort: 'date' }, { addQueryPrefix: true });

  return await payloadClientQuery<HawkEvent[]>({
    url: API_CLIENT_PATHS.events,
    query,
    method: 'GET',
    fallback: [],
  });
};

export { fetchEvent, fetchAgendaEvents, getEventsByMonthAndYear };
