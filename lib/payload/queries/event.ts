import { HawkProject } from '@/payload-types';
import { getPayloadConfig } from '../server';
import { PaginatedDocs } from 'payload';

const EVENTS_COLLECTION = 'hawk_projects';

export const getSingleEventsQuery = async (slug: string): Promise<HawkProject> => {
  const payload = await getPayloadConfig();
  const event = await payload
    .find({ collection: EVENTS_COLLECTION, where: { slug: { equals: slug } }, limit: 1 })
    .then((res) => res.docs[0]);
  return event;
};

export const getEventsQuery = async (page: number): Promise<PaginatedDocs<HawkProject>> => {
  const payload = await getPayloadConfig();
  const events = await payload.find({
    collection: EVENTS_COLLECTION,
    limit: 10,
    page,
    sort: '-date',
  });

  return events;
};
