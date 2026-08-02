import type { CollectionAfterChangeHook } from 'payload';
import type { News } from '@/payload-types';
import { createNotification } from '@/payload/utilities/collections/createNotification';

export const notifyNewsChange: CollectionAfterChangeHook<News> = async ({
  doc,
  operation,
  req,
  previousDoc,
}) => {
  const title = doc.title || String(doc.id);
  const published = doc._status === 'published';

  if (operation === 'create') {
    await createNotification(req.payload, {
      collection: 'news',
      situation: 'create',
      title,
      message: `A new news article "${title}" has been created${published ? ' and is visible on the site' : ' (draft)'}.`,
      actor: req.user?.id,
      docId: doc.id,
    });
  }

  // Notify only on the draft → published transition, not on every autosave.
  if (operation === 'update' && published && previousDoc?._status !== 'published') {
    await createNotification(req.payload, {
      collection: 'news',
      situation: 'update',
      title,
      message: `The news article "${title}" is now visible on the site.`,
      actor: req.user?.id,
      docId: doc.id,
    });
  }

  return doc;
};
