import type { CollectionAfterChangeHook } from 'payload';
import type { Page } from '@/payload-types';
import { createNotification } from '@/payload/utilities/collections/createNotification';

export const notifyPageChange: CollectionAfterChangeHook<Page> = async ({
  doc,
  operation,
  req,
  previousDoc,
}) => {
  const title = doc.title || 'Untitled Page';
  const published = doc._status === 'published';

  if (operation === 'create') {
    await createNotification(req.payload, {
      collection: 'pages',
      situation: 'create',
      title,
      message: `A new page "${title}" has been created${published ? ' and is visible on the site' : ' (not yet visible)'}.`,
      actor: req.user?.id,
      docId: doc.id,
    });
  }

  // Notify only on the draft → published transition, not on every autosave.
  if (operation === 'update' && published && previousDoc?._status !== 'published') {
    await createNotification(req.payload, {
      collection: 'pages',
      situation: 'update',
      title,
      message: `The page "${title}" is now visible on the site.`,
      actor: req.user?.id,
      docId: doc.id,
    });
  }

  return doc;
};
