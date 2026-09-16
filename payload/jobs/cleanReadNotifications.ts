import type { TaskConfig } from 'payload';

type CleanReadNotificationsOutput = {
  deletedCount: number;
};

export const cleanReadNotificationsTask: TaskConfig<{
  input: object;
  output: CleanReadNotificationsOutput;
}> = {
  slug: 'cleanReadNotifications',
  label: 'Clean Read Notifications',
  inputSchema: [],
  outputSchema: [
    {
      name: 'deletedCount',
      type: 'number',
      label: 'Number of deleted notifications',
    },
  ],
  schedule: [
    {
      cron: '0 0 0 * * 0', // Every Sunday at midnight
      queue: 'default',
    },
  ],
  handler: async ({ req }) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Hard ceiling regardless of read state. The read+30d rule alone could only
    // ever reach rows an admin had clicked, and nothing else sets `read: true` —
    // so on the one collection that grows without bound the sweep deleted
    // nothing at all unless someone kept the bell clear.
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const { docs, errors } = await req.payload.delete({
      collection: 'notifications',
      where: {
        or: [
          {
            and: [
              { read: { equals: true } },
              { createdAt: { less_than: thirtyDaysAgo.toISOString() } },
            ],
          },
          { createdAt: { less_than: ninetyDaysAgo.toISOString() } },
        ],
      },
      overrideAccess: true,
      depth: 0,
    });

    const deletedCount = docs.length;

    if (errors.length > 0) {
      req.payload.logger.warn(
        `[cleanReadNotifications] ${errors.length} notification(s) could not be deleted.`
      );
    }

    req.payload.logger.info(
      `[cleanReadNotifications] Deleted ${deletedCount} read notifications older than 30 days.`
    );

    return {
      output: { deletedCount },
    };
  },
};
