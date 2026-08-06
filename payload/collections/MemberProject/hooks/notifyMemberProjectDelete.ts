import type { CollectionAfterDeleteHook } from 'payload';
import type { MemberProject } from '@/payload-types';
import { createNotification } from '@/payload/utilities/collections/createNotification';

/**
 * Deleting a member submission was previously silent — no activity-log entry,
 * unlike HawkProject/HawkEvent which both log deletes. Member submissions carry
 * a submitter's name/email, so a record of who removed one (and when) matters.
 */
export const notifyMemberProjectDelete: CollectionAfterDeleteHook<MemberProject> = async ({
  doc,
  req,
}) => {
  const title = doc.title || String(doc.id);

  await createNotification(req.payload, {
    collection: 'member_projects',
    situation: 'delete',
    title,
    message: `The member submission "${title}" has been deleted.`,
    actor: req.user?.id,
    // No docId: the document is gone, so an admin link would 404.
  });

  return doc;
};
