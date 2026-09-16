import type { CollectionAfterChangeHook } from 'payload';
import type { HawkProject } from '@/payload-types';
import { createNotification } from '@/payload/utilities/collections/createNotification';

export const notifyProjectChange: CollectionAfterChangeHook<HawkProject> = async ({
  doc,
  operation,
  req,
  previousDoc,
}) => {
  const title = doc.heading || doc.slug || String(doc.id);

  const published = doc._status === 'published';
  const becamePublished = published && previousDoc?._status !== 'published';

  if (operation === 'create' || becamePublished) {
    await createNotification(req.payload, {
      collection: 'hawk_projects',
      situation: operation,
      title,
      message: `The project "${title}" has been ${operation === 'create' ? 'created' : 'updated'}.`,
      actor: req.user?.id,
      docId: doc.id,
    });
  }

  return doc;
};
