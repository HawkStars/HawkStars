import { HawkEvent } from '@/payload-types';
import { getPayloadConfig } from '../server';
import { Language } from '@/i18n/settings';
import { PaginatedDocs } from 'payload';

const EVENTS_COLLECTION = 'hawk_events';

export const getSingleEventsQuery = async (slug: string, locale: Language): Promise<HawkEvent> => {
  const payload = await getPayloadConfig();
  const event = await payload.findByID({ collection: EVENTS_COLLECTION, id: slug, locale });
  return event;
};

export const getEventsQuery = async (
  page: number,
  locale: Language
): Promise<PaginatedDocs<HawkEvent>> => {
  const payload = await getPayloadConfig();
  const events = await payload.find({
    collection: EVENTS_COLLECTION,
    limit: 10,
    page,
    locale,
    sort: '-date',
  });

  return events;
};
