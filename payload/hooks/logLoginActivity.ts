import type { CollectionAfterLoginHook } from 'payload';

/**
 * Records an activity-log entry whenever a user enters the platform.
 *
 * Writes to the `notifications` collection (the activity log) with
 * situation `login` and the acting user stored in `actor`.
 */
export const logLoginActivity: CollectionAfterLoginHook = async ({ user, req }) => {
  const { payload } = req;

  try {
    const who = user?.name || user?.email || 'A user';

    await payload.create({
      collection: 'notifications',
      data: {
        title: `${who} entered the platform`,
        message: `${who} signed in to the admin panel.`,
        situation: 'login',
        actor: user?.id,
        read: false,
      },
    });
  } catch (error) {
    // Never let activity logging break the login flow.
    console.error('Failed to log login activity:', error);
  }

  return user;
};
