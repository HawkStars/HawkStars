import type { CollectionAfterLoginHook } from 'payload';
import { createNotification } from '@/payload/utilities/collections/createNotification';

/**
 * Records an activity-log entry whenever a user enters the platform.
 *
 * Writes to the `notifications` collection (the activity log) with situation
 * `login` and the acting user stored in `actor`.
 */
export const logLoginActivity: CollectionAfterLoginHook = async ({ user, req }) => {
  const who = user?.name || user?.email || 'A user';

  await createNotification(req.payload, {
    collection: 'login',
    situation: 'login',
    title: who,
    message: `${who} signed in to the admin panel.`,
    actor: user?.id,
  });

  return user;
};
