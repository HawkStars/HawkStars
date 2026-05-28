import { HawkEvent } from '@/payload-types';
import { getPayloadConfig } from '../server';
import { Language } from '@/i18n/settings';

const EVENTS_COLLECTION = 'hawk_events';

export const getAgendaEventsQuery = async (
  locale: Language,
  month: number,
  year: number
): Promise<HawkEvent[]> => {
  const payload = await getPayloadConfig();

  // Current calendar month: from the 1st (00:00) to the last day (23:59:59).
  const startOfMonth = new Date(year, month, 1, 0, 0, 0, 0);
  const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

  const events = await payload.find({
    collection: EVENTS_COLLECTION,
    limit: 100,
    sort: 'date',
    locale,
    where: {
      status: { equals: 'published' },
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
    },
  });

  return events.docs;
};
