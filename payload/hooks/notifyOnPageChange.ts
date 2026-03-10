import type { CollectionAfterChangeHook } from 'payload';

export const notifyOnPageChange: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
  previousDoc,
}) => {
  const { payload } = req;

  try {
    const title = doc.title || 'Untitled Page';

    if (operation === 'create') {
      await payload.create({
        collection: 'notifications',
        data: {
          title: `New page created: "${title}"`,
          message: `A new page "${title}" has been created${doc.visible ? ' and is visible on the site' : ' (not yet visible)'}.`,
          type: 'page_published',
          read: false,
          link: `/admin/collections/pages/${doc.id}`,
          relatedCollection: 'pages',
          relatedDocId: String(doc.id),
        },
      });
    }

    // Notify when a page becomes visible
    if (
      operation === 'update' &&
      doc.visible === true &&
      previousDoc?.visible === false
    ) {
      await payload.create({
        collection: 'notifications',
        data: {
          title: `Page published: "${title}"`,
          message: `The page "${title}" is now visible on the site.`,
          type: 'page_published',
          read: false,
          link: `/admin/collections/pages/${doc.id}`,
          relatedCollection: 'pages',
          relatedDocId: String(doc.id),
        },
      });
    }
  } catch (error) {
    console.error('Failed to create page notification:', error);
  }

  return doc;
};
