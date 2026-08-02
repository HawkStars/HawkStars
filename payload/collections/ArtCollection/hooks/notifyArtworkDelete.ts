import type { CollectionAfterDeleteHook } from 'payload';
import type { Artwork } from '@/payload-types';
import { createNotification } from '@/payload/utilities/collections/createNotification';

export const notifyArtworkDelete: CollectionAfterDeleteHook<Artwork> = async ({ doc, req }) => {
  const title = doc.title || doc.slug || String(doc.id);

  await createNotification(req.payload, {
    collection: 'artworks',
    situation: 'delete',
    title,
    message: `The artwork "${title}" has been deleted.`,
    actor: req.user?.id,
  });

  return doc;
};
