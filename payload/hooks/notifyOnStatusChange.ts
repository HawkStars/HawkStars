import type { CollectionAfterChangeHook } from 'payload';

/**
 * Sends notifications when content status transitions occur.
 *
 * Triggers:
 *   - draft → in_review:  "Submitted for review"
 *   - in_review → published: "Published"
 *   - draft → published: "Published directly"
 *   - published → draft:  "Unpublished"
 *   - in_review → draft:  "Sent back to draft"
 *   - published → in_review: "Moved to review"
 *
 * Uses the `situation` field from the Notification collection
 * (create, update, delete, message, other).
 */
export const notifyOnStatusChange: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
  previousDoc,
  collection,
}) => {
  const { payload } = req;

  // Only fire on updates where status actually changed
  if (operation !== 'update') return doc;

  const prevStatus = previousDoc?.status;
  const newStatus = doc.status;

  if (!prevStatus || !newStatus || prevStatus === newStatus) return doc;

  const title = doc.title || doc.heading || 'Untitled';
  const collectionSlug = collection?.slug || 'unknown';
  const collectionLabel =
    collectionSlug === 'pages' ? 'Page' : collectionSlug === 'news' ? 'Article' : 'Content';

  type TransitionInfo = {
    title: string;
    message: string;
    situation: 'create' | 'update' | 'message' | 'other';
  };

  const transitionMessages: Record<string, TransitionInfo> = {
    'draft→in_review': {
      title: `${collectionLabel} submitted for review: "${title}"`,
      message: `The ${collectionLabel.toLowerCase()} "${title}" has been submitted for review and is awaiting admin approval.`,
      situation: 'update',
    },
    'in_review→published': {
      title: `${collectionLabel} published: "${title}"`,
      message: `The ${collectionLabel.toLowerCase()} "${title}" has been approved and is now live on the website.`,
      situation: 'update',
    },
    'draft→published': {
      title: `${collectionLabel} published: "${title}"`,
      message: `The ${collectionLabel.toLowerCase()} "${title}" has been published directly by an admin.`,
      situation: 'update',
    },
    'published→draft': {
      title: `${collectionLabel} unpublished: "${title}"`,
      message: `The ${collectionLabel.toLowerCase()} "${title}" has been moved back to draft and is no longer visible on the site.`,
      situation: 'update',
    },
    'in_review→draft': {
      title: `${collectionLabel} sent back to draft: "${title}"`,
      message: `The ${collectionLabel.toLowerCase()} "${title}" has been sent back to draft for further edits.`,
      situation: 'update',
    },
    'published→in_review': {
      title: `${collectionLabel} moved to review: "${title}"`,
      message: `The ${collectionLabel.toLowerCase()} "${title}" has been moved from published back to in review.`,
      situation: 'update',
    },
  };

  const key = `${prevStatus}→${newStatus}`;
  const notification = transitionMessages[key];

  if (!notification) return doc;

  try {
    await payload.create({
      collection: 'notifications',
      data: {
        title: notification.title,
        message: notification.message,
        situation: notification.situation,
        read: false,
        link: `/admin/collections/${collectionSlug}/${doc.id}`,
        relatedCollection: collectionSlug,
        relatedDocId: String(doc.id),
      },
    });
  } catch (error) {
    console.error('Failed to create status change notification:', error);
  }

  return doc;
};
