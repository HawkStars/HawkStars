import type { PayloadHandler } from 'payload';
import * as Sentry from '@sentry/nextjs';
import { getDashboardStats } from '@/lib/payload/endpoints/getDashboardStats';

export const dashboardStatsHandler: PayloadHandler = async (req) => {
  const { payload, user } = req;

  // Admin dashboard data (collection counts, donation totals) must not be public.
  if (!user || !user.isAdmin) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const stats = await getDashboardStats(payload);
    return Response.json(stats);
  } catch (error) {
    Sentry.captureException(error);
    return Response.json({ error: `Failed to fetch statistics. ${error}` }, { status: 500 });
  }
};

export default dashboardStatsHandler;
