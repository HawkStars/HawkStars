import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload';

export const notifyOnMediaUpload: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  const { payload } = req;

  try {
    if (operation === 'create') {
      const filename = doc.filename || doc.alt || 'Unknown file';
      const section = doc.section ? ` (${doc.section})` : '';

      await payload.create({
        collection: 'notifications',
        data: {
          title: `New media uploaded: "${filename}"`,
          message: `A new media file "${filename}"${section} has been uploaded.`,
          situation: 'create',
          link: `/admin/collections/media/${doc.id}`,
          relatedCollection: 'media',
          relatedDocId: String(doc.id),
        },
      });
    }
  } catch (error) {
    console.error('Failed to create media notification:', error);
  }

  return doc;
};

export const notifyOnMediaDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  const { payload } = req;

  try {
    const filename = doc.filename || doc.alt || 'Unknown file';
    const section = doc.section ? ` (${doc.section})` : '';

    await payload.create({
      collection: 'notifications',
      data: {
        title: `Media deleted: "${filename}"`,
        message: `The media file "${filename}"${section} has been deleted.`,
        relatedCollection: 'media',
        situation: 'delete',
      },
    });
  } catch (error) {
    console.error('Failed to create media deletion notification:', error);
  }

  return doc;
};
