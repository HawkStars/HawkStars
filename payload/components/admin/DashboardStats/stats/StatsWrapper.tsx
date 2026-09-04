import type { Payload } from 'payload';
import { getDashboardStats } from '@/lib/payload/endpoints/getDashboardStats';
import ContentStatusWidget from '../ContentStatusWidget';
import StatisticsWidget from '../StatisticsWidget';
import type { Stats } from '../types';

/**
 * Reads dashboard stats via the Payload Local API (bypassing HTTP entirely,
 * so there's no request/session cookie to worry about forwarding) and gates
 * the result on `isAdmin` itself, since `afterDashboard` renders for every
 * logged-in user (editors included), not just admins.
 */
const loadStats = async (
  payload: Payload,
  isAdmin: boolean
): Promise<{ stats: Stats | null; error: string | null }> => {
  if (!isAdmin) return { stats: null, error: 'Unauthorized' };

  try {
    return { stats: await getDashboardStats(payload), error: null };
  } catch {
    return { stats: null, error: 'Failed to fetch statistics.' };
  }
};

const StatsWrapper = async ({ payload, isAdmin }: { payload: Payload; isAdmin: boolean }) => {
  const { stats, error } = await loadStats(payload, isAdmin);

  return (
    <>
      <StatisticsWidget stats={stats} loading={false} error={error} />
      <ContentStatusWidget stats={stats} loading={false} error={error} />
    </>
  );
};

export default StatsWrapper;
