import type { CollectionAfterDeleteHook } from 'payload';
import type { Contribution } from '@/payload-types';
import { createNotification } from '@/payload/utilities/collections/createNotification';

/**
 * Deleting a contribution was previously silent — no activity-log entry, and
 * with no `versions` enabled on this collection either, a deleted donation
 * record left zero trail of who removed it or when. This at least logs the
 * delete; see the collection's new `versions` config for the rest of the fix.
 */
export const notifyContributionDelete: CollectionAfterDeleteHook<Contribution> = async ({
  doc,
  req,
}) => {
  const donor = doc.donor || 'Anonymous';
  const value = typeof doc.value === 'number' ? doc.value.toFixed(2) : '0.00';

  await createNotification(req.payload, {
    collection: 'contributions',
    situation: 'delete',
    title: `Contribution from ${donor}`,
    message: `The €${value} contribution from ${donor} has been deleted.`,
    actor: req.user?.id,
    // No docId: the document is gone, so an admin link would 404.
  });

  return doc;
};
