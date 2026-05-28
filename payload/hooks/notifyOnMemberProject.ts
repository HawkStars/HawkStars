import type { CollectionAfterChangeHook } from 'payload';

/**
 * Creates an in-admin notification when a member submits a new project, so an
 * admin knows to verify the submitter's membership and confirm it. Also notifies
 * when a project is confirmed and goes live on the public showcase.
 */
export const notifyOnMemberProject: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
  previousDoc,
}) => {
  const { payload } = req;

  try {
    if (operation === 'create') {
      const submitter = doc.submitter?.submitter_name || 'A member';

      await payload.create({
        collection: 'notifications',
        data: {
          title: `New member project: "${doc.title}"`,
          message: `${submitter} submitted a project for the Corner of the Members. Verify their membership and check "Confirmed" to publish it on the showcase.`,
          situation: 'create',
          link: `/admin/collections/member_projects/${doc.id}`,
          relatedCollection: 'member_projects',
          relatedDocId: String(doc.id),
        },
      });
    }

    // Notify when a project gets confirmed and becomes publicly visible.
    if (operation === 'update' && doc.is_confirmed === true && previousDoc?.is_confirmed === false) {
      await payload.create({
        collection: 'notifications',
        data: {
          title: `Member project confirmed: "${doc.title}"`,
          message: `"${doc.title}" has been confirmed and is now live on the Corner of the Members showcase.`,
          situation: 'update',
          link: `/admin/collections/member_projects/${doc.id}`,
          relatedCollection: 'member_projects',
          relatedDocId: String(doc.id),
        },
      });
    }
  } catch (error) {
    // Silently fail — notifications should never break the main operation.
    console.error('Failed to create member project notification:', error);
  }

  return doc;
};
