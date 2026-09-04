import React, { Suspense } from 'react';
import type { ServerProps } from 'payload';
import { ActivityLogWidget } from './ActivityLogWidget';
import StatsWrapper from './stats/StatsWrapper';

/**
 * Dashboard widgets container (registered as `afterDashboard`).
 *
 * Fetches the shared dashboard stats once and lays out three widgets:
 *   - Statistics       (contributions + collection counts)
 *   - Content Status   (Pages / News / Projects by draft·review·published)
 *   - Activity Log     (logins + document create/update/delete, with actor)
 *
 * Payload passes `payload`/`user` into `afterDashboard` components via
 * `ServerProps` — StatsWrapper uses `payload` to read stats through the
 * Local API directly (no HTTP round trip, so there's no session cookie to
 * forward), and gates the data on `user.isAdmin` itself.
 */
export const DashboardStats: React.FC<ServerProps> = ({ payload, user }) => {
  return (
    <div className='mt-6 p-6'>
      <div className='grid grid-cols-1 gap-6 xl:grid-cols-3'>
        <div className='flex flex-col gap-6 xl:col-span-2'>
          <Suspense fallback={<></>}>
            <StatsWrapper payload={payload} isAdmin={Boolean(user?.isAdmin)} />
          </Suspense>
        </div>
        <ActivityLogWidget />
      </div>
    </div>
  );
};

export default DashboardStats;
