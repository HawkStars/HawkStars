import type { HawkEvent } from '@/payload-types';
import type { Where } from 'payload';
import { stringify } from 'qs-esm';

import API_CLIENT_PATHS from '../constants';
import { Language } from '@/i18n/settings';
import payloadClientQuery from '../client';

/**
 * Fetch upcoming hawk events for the AgendaBlock.
 *
 * NOTE: previously this fetched from /api/hawk_projects — it now correctly
 * targets /api/hawk_events, which holds the date/type_event fields being filtered.
 */

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

export { getEventsByMonthAndYear };
