import { HawkProject } from '@/payload-types';
import { getPayloadConfig } from '../server';
import { PaginatedDocs } from 'payload';
import { Language } from '@/i18n/settings';

const EVENTS_COLLECTION = 'hawk_projects';

export const getSingleEventsQuery = async (
  slug: string,
  locale: Language,
  opts?: { preview: boolean }
): Promise<HawkProject> => {
  const payload = await getPayloadConfig();
  const event = await payload.find({
    collection: EVENTS_COLLECTION,
    where: { slug: { equals: slug } },
    locale,
    limit: 1,
    draft: opts?.preview || false,
  });
  return event.docs[0] ?? null;
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
