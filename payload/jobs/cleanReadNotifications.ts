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

    const { docs, errors } = await req.payload.delete({
      collection: 'notifications',
      where: {
        and: [
          { read: { equals: true } },
          { createdAt: { less_than: thirtyDaysAgo.toISOString() } },
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
