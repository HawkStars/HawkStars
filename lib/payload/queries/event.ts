import { HawkEvent } from '@/payload-types';
import { getPayloadConfig } from '../client';

const EVENTS_COLLECTION = 'hawk_events';

export const getSingleEventsQuery = async (slug: string): Promise<HawkEvent> => {
  const payload = await getPayloadConfig();
  const event = await payload.findByID({ collection: EVENTS_COLLECTION, id: slug });
  return event;
};

export const getEventsQuery = async (
  page: number
): Promise<{ docs: HawkEvent[]; totalPages: number }> => {
  const payload = await getPayloadConfig();
  const events = await payload.find({
    collection: EVENTS_COLLECTION,
    limit: 10,
    page,
    sort: '-date',
  });

  const { docs, totalPages } = events;

  return { docs, totalPages };
};
