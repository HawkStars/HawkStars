import { HawkEvent, HawkProject } from '@/payload-types';
import { getPayloadConfig } from '../server';
import { Language } from '@/i18n/settings';

const EVENTS_COLLECTION = 'hawk_events';

export const getAgendaEventsQuery = async (locale: Language): Promise<HawkEvent[]> => {
  const payload = await getPayloadConfig();
  const events = await payload.find({
    collection: EVENTS_COLLECTION,
    limit: 100,
    sort: 'date',
    locale,
  });

  return events.docs;
};
