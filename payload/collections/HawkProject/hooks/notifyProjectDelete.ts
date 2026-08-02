import type { CollectionAfterDeleteHook } from 'payload';
import type { HawkProject } from '@/payload-types';
import { createNotification } from '@/payload/utilities/collections/createNotification';

export const notifyProjectDelete: CollectionAfterDeleteHook<HawkProject> = async ({ doc, req }) => {
  const title = doc.heading || doc.slug || String(doc.id);

  await createNotification(req.payload, {
    collection: 'hawk_projects',
    situation: 'delete',
    title,
    message: `The project "${title}" has been deleted.`,
    actor: req.user?.id,
    // No docId: the document is gone, so an admin link would 404.
  });

  return doc;
};
