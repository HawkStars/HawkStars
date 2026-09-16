import type { JobsConfig } from 'payload';
import { refreshInstagramTokenTask } from './tasks/refreshInstagramToken';
import { cleanReadNotificationsTask } from './cleanReadNotifications';
import { importCrowdfundingSupportersTask } from './tasks/importCrowdfundingSupporters';
import { authenticatedAdmin } from '@/payload/access/authenticatedAdmin';

export const jobs: JobsConfig = {
  tasks: [refreshInstagramTokenTask, cleanReadNotificationsTask, importCrowdfundingSupportersTask],
  /**
   * Payload defaults every one of these to `Boolean(user)`, so leaving the block
   * out made `GET /api/payload-jobs/run` reachable by the regular content tier —
   * which let a non-admin trigger `cleanReadNotifications`, and that deletes with
   * `overrideAccess: true` even though `Notification.delete` is admin-only. It
   * also let anyone logged in append to the public donor wall and spam Meta's
   * token endpoint. `autoRun` below covers the legitimate path; no human needs
   * to call these.
   */
  access: {
    run: authenticatedAdmin,
    queue: authenticatedAdmin,
    cancel: authenticatedAdmin,
  },
  /**
   * Automatically run queued jobs every 5 minutes.
   * This picks up jobs that were scheduled via task `schedule` configs (e.g. refreshInstagramToken).
   *
   * @remarks Do not use autoRun on serverless platforms such as Vercel.
   */
  autoRun: [
    {
      cron: '*/5 * * * *',
      queue: 'default',
    },
  ],
  deleteJobOnComplete: true,
};
