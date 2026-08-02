import type { CollectionAfterDeleteHook } from 'payload';
import type { Media } from '@/payload-types';
import { createNotification } from '@/payload/utilities/collections/createNotification';

export const notifyMediaDelete: CollectionAfterDeleteHook<Media> = async ({ doc, req }) => {
  const filename = doc.filename || doc.alt || 'Unknown file';
  const section = doc.section ? ` (${doc.section})` : '';

  await createNotification(req.payload, {
    collection: 'media',
    situation: 'delete',
    title: filename,
    message: `The media file "${filename}"${section} has been deleted.`,
    actor: req.user?.id,
  });

  return doc;
};
