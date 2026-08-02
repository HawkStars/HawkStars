import type { CollectionAfterChangeHook } from 'payload';
import type { Media } from '@/payload-types';
import { createNotification } from '@/payload/utilities/collections/createNotification';

export const notifyMediaUpload: CollectionAfterChangeHook<Media> = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== 'create') return doc;

  const filename = doc.filename || doc.alt || 'Unknown file';
  const section = doc.section ? ` (${doc.section})` : '';

  await createNotification(req.payload, {
    collection: 'media',
    situation: 'create',
    title: filename,
    message: `The media file "${filename}"${section} has been uploaded.`,
    actor: req.user?.id,
    docId: doc.id,
  });

  return doc;
};
