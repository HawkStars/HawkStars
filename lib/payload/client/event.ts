import type { AgendaBlock, HawkEvent } from '@/payload-types';
import type { Where } from 'payload';
import { stringify } from 'qs-esm';

import API_CLIENT_PATHS from './constants';
import { Language } from '@/i18n/settings';

// --- UpcomingHawkEventBlock ---

type FetchEventOptions = {
  controller: AbortController;
  eventType?: ('local_event' | 'international_event' | 'other')[] | null | undefined;
};

const fetchEvent = async ({ controller, eventType }: FetchEventOptions) => {
  const where: Where = {};
  if (eventType && eventType.length > 0) where.type_event = { in: eventType };

  const stringifiedQuery = stringify({ where, limit: 1 }, { addQueryPrefix: true });

  try {
    const response = await fetch(`${API_CLIENT_PATHS.events}${stringifiedQuery}`, {
      method: 'GET',
      signal: controller.signal,
    });

    if (!response.ok) {
      console.error('Failed to fetch upcoming event:', response.statusText);
      return null;
    }

    const data = await response.json();
    return data?.docs?.[0] || null;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null;
    console.error('Error fetching upcoming event:', error);
    return null;
  }
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

  try {
    const response = await fetch(`${API_CLIENT_PATHS.events}${query}`);

    if (!response.ok) {
      console.error('AgendaBlock: failed to fetch events', response.statusText);
      return [];
    }

    const data = await response.json();
    return data?.docs ?? [];
  } catch (error) {
    console.error('AgendaBlock: error fetching events', error);
    return [];
  }
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
    _status: { equals: 'published' },
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

  const response = await fetch(`${API_CLIENT_PATHS.events}${query}`);

  if (!response.ok) {
    console.error('AgendaBlock: failed to fetch events', response.statusText);
    return [];
  }

  const data = await response.json();
  return data?.docs ?? [];
};

export { fetchEvent, fetchAgendaEvents, getEventsByMonthAndYear };
