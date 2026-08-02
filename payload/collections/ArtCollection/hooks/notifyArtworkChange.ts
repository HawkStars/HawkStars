import type { CollectionAfterChangeHook } from 'payload';
import type { Artwork } from '@/payload-types';
import { createNotification } from '@/payload/utilities/collections/createNotification';

export const notifyArtworkChange: CollectionAfterChangeHook<Artwork> = async ({
  doc,
  operation,
  req,
}) => {
  const title = doc.title || doc.slug || String(doc.id);

  if (operation === 'create' || operation === 'update') {
    await createNotification(req.payload, {
      collection: 'artworks',
      situation: operation,
      title,
      message: `The artwork "${title}" has been ${operation === 'create' ? 'added to' : 'updated in'} the collection.`,
      actor: req.user?.id,
      docId: doc.id,
    });
  }

  return doc;
};
