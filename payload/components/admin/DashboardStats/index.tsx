import React, { Suspense } from 'react';
import { ActivityLogWidget } from './ActivityLogWidget';
import StatsWrapper from './stats/StatsWrapper';

/**
 * Dashboard widgets container (registered as `afterDashboard`).
 *
 * Fetches the shared dashboard stats once and lays out three widgets:
 *   - Statistics       (contributions + collection counts)
 *   - Content Status   (Pages / News / Projects by draft·review·published)
 *   - Activity Log     (logins + document create/update/delete, with actor)
 */
export const DashboardStats: React.FC = async () => {
  return (
    <div className='mt-6 p-6'>
      <div className='grid grid-cols-1 gap-6 xl:grid-cols-3'>
        <div className='flex flex-col gap-6 xl:col-span-2'>
          <Suspense fallback={<></>}>
            <StatsWrapper />
          </Suspense>
        </div>
        <ActivityLogWidget />
      </div>
    </div>
  );
};

export default DashboardStats;
