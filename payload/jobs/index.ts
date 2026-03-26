import type { JobsConfig } from 'payload';
import { refreshInstagramTokenTask } from './tasks/refreshInstagramToken';

export const jobs: JobsConfig = {
  tasks: [refreshInstagramTokenTask],
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
