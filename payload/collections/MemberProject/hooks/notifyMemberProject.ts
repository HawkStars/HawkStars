import type { CollectionAfterChangeHook } from 'payload';
import type { MemberProject } from '@/payload-types';
import { createNotification } from '@/payload/utilities/collections/createNotification';

/**
 * Creates an activity-log entry when a member submits a new project, so an admin
 * knows to verify the submitter's membership and confirm it. Also logs the moment
 * a project is confirmed and goes live on the public showcase.
 */
export const notifyMemberProject: CollectionAfterChangeHook<MemberProject> = async ({
  doc,
  operation,
  req,
  previousDoc,
}) => {
  const title = doc.title || String(doc.id);

  if (operation === 'create') {
    const submitter = doc.submitter?.submitter_name || 'A member';

    await createNotification(req.payload, {
      collection: 'member_projects',
      situation: 'create',
      title,
      message: `${submitter} submitted a project for the Corner of the Members. Verify their membership and check "Confirmed" to publish it on the showcase.`,
      actor: req.user?.id,
      docId: doc.id,
    });
  }

  if (operation === 'update' && doc.is_confirmed === true && previousDoc?.is_confirmed === false) {
    await createNotification(req.payload, {
      collection: 'member_projects',
      situation: 'update',
      title,
      message: `"${title}" has been confirmed and is now live on the Corner of the Members showcase.`,
      actor: req.user?.id,
      docId: doc.id,
    });
  }

  return doc;
};
