import { HawkEvent } from '@/payload-types';
import { getPayloadConfig } from '../client';

export const getSingleEventsQuery = async (slug: string): Promise<HawkEvent> => {
  const payload = await getPayloadConfig();
  const event = await payload.findByID({ collection: 'hawk_events', id: slug });
  return event;
};
