import type { AgendaBlock } from '@/payload-types';
import type { Where } from 'payload';
import { stringify } from 'qs-esm';

import API_CLIENT_PATHS from './constants';

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

export { fetchEvent, fetchAgendaEvents };
