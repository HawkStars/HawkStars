'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { ActivityLogWidget } from './ActivityLogWidget';
import { ContentStatusWidget } from './ContentStatusWidget';
import { StatisticsWidget } from './StatisticsWidget';
import type { Stats } from './types';
import { fetchDashboardStats } from './queries';

/**
 * Dashboard widgets container (registered as `afterDashboard`).
 *
 * Fetches the shared dashboard stats once and lays out three widgets:
 *   - Statistics       (contributions + collection counts)
 *   - Content Status   (Pages / News / Projects by draft·review·published)
 *   - Activity Log     (logins + document create/update/delete, with actor)
 */
export const DashboardStats: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className='mt-6 p-6'>
      <div className='grid grid-cols-1 gap-6 xl:grid-cols-3'>
        <div className='flex flex-col gap-6 xl:col-span-2'>
          <Suspense fallback={<></>}>
            <StatisticsWidget stats={stats} loading={loading} error={error} />
            <ContentStatusWidget stats={stats} loading={loading} error={error} />
          </Suspense>
        </div>
        <ActivityLogWidget />
      </div>
    </div>
  );
};

export default DashboardStats;
