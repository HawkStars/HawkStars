import type { CollectionAfterChangeHook } from 'payload';
import type { HawkEvent } from '@/payload-types';
import { createNotification } from '@/payload/utilities/collections/createNotification';

export const notifyEventChange: CollectionAfterChangeHook<HawkEvent> = async ({
  doc,
  operation,
  req,
}) => {
  const title = doc.heading || doc.slug || String(doc.id);

  if (operation === 'create' || operation === 'update') {
    await createNotification(req.payload, {
      collection: 'hawk_events',
      situation: operation,
      title,
      message: `The event "${title}" has been ${operation === 'create' ? 'created' : 'updated'}.`,
      actor: req.user?.id,
      docId: doc.id,
    });
  }

  return doc;
};
