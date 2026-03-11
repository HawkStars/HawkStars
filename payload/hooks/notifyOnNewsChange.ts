import type { CollectionAfterChangeHook } from 'payload';

export const notifyOnNewsChange: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
  previousDoc,
}) => {
  const { payload } = req;

  try {
    const title = doc.title || 'Untitled Article';

    if (operation === 'create') {
      await payload.create({
        collection: 'notifications',
        data: {
          title: `New article created: "${title}"`,
          message: `A new news article "${title}" has been created${doc.visible ? ' and is visible on the site' : ' (draft)'}.`,
          situation: 'create',
          link: `/admin/collections/news/${doc.id}`,
          relatedCollection: 'news',
          relatedDocId: String(doc.id),
        },
      });
    }

    // Notify when a news article becomes visible
    if (operation === 'update' && doc.visible === true && previousDoc?.visible === false) {
      await payload.create({
        collection: 'notifications',
        data: {
          title: `Article published: "${title}"`,
          message: `The news article "${title}" is now visible on the site.`,
          situation: 'update',
          read: false,
          link: `/admin/collections/news/${doc.id}`,
          relatedCollection: 'news',
          relatedDocId: String(doc.id),
        },
      });
    }
  } catch (error) {
    console.error('Failed to create news notification:', error);
  }

  return doc;
};
