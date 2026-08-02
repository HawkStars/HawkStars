import type { CollectionAfterDeleteHook } from 'payload';
import type { HawkEvent } from '@/payload-types';
import { createNotification } from '@/payload/utilities/collections/createNotification';

export const notifyEventDelete: CollectionAfterDeleteHook<HawkEvent> = async ({ doc, req }) => {
  const title = doc.heading || doc.slug || String(doc.id);

  await createNotification(req.payload, {
    collection: 'hawk_events',
    situation: 'delete',
    title,
    message: `The event "${title}" has been deleted.`,
    actor: req.user?.id,
  });

  return doc;
};
