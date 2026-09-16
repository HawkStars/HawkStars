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

  // hawk_projects has autosave at a 2s interval, so afterChange fires continuously
  // while an editor has a project open. Without this guard a 20-minute session wrote
  // ~600 notification rows — the main driver of that collection's unbounded growth.
  // Pages and News already carry the same check.
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
