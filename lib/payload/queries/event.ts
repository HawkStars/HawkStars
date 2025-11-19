import { HawkEvent } from '@/payload-types';
import { getPayloadConfig } from '../server';
import { PaginatedDocs } from 'payload';

const EVENTS_COLLECTION = 'hawk_events';

export const getSingleEventsQuery = async (slug: string): Promise<HawkEvent> => {
  const payload = await getPayloadConfig();
  const event = await payload.findByID({ collection: EVENTS_COLLECTION, id: slug });
  return event;
};

export const getEventsQuery = async (page: number): Promise<PaginatedDocs<HawkEvent>> => {
  const payload = await getPayloadConfig();
  const events = await payload.find({
    collection: EVENTS_COLLECTION,
    limit: 10,
    page,
    sort: '-date',
  });

  return events;
};
