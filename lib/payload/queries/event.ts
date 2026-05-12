import { HawkEvent } from '@/payload-types';
import { getPayloadConfig } from '../server';
import { Language } from '@/i18n/settings';

const EVENTS_COLLECTION = 'hawk_events';

export const getSingleEventsQuery = async (
  slug: string,
  locale: Language,
  opts?: { preview: boolean }
): Promise<HawkEvent> => {
  const payload = await getPayloadConfig();
  const event = await payload.find({
    collection: EVENTS_COLLECTION,
    where: { slug: { equals: slug }, status: { equals: opts?.preview ? null : 'published' } },
    locale,
    limit: 1,
    depth: 3,
    draft: opts?.preview || false,
  });
  return event.docs[0] ?? null;
};
