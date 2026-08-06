import type { PayloadHandler } from 'payload';
import totalContributioValueQuery from '@/lib/payload/endpoints/totalContributioValueQuery';

/**
 * GET /api/sum-contributions
 *
 * REST wrapper around `totalContributioValueQuery`. The bare query function is
 * also called server-side (Local API) by `getSumContributions` to render the
 * public donation total — that path must stay open, so the auth check lives
 * here in the HTTP handler rather than inside the shared query function.
 */
export const sumContributionsHandler: PayloadHandler = async (req) => {
  if (!req.user || !req.user.isAdmin) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return totalContributioValueQuery({ payload: req.payload });
};

export default sumContributionsHandler;
