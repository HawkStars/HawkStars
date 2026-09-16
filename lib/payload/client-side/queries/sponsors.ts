import { stringify } from 'qs-esm';
import type { Where } from 'payload';
import type { Sponsor, SponsorsBlock } from '@/payload-types';
import payloadClientQuery from '../client';

type FetchSponsorsOptions = {
  tier?: SponsorsBlock['tier'];
  limit?: number | null;
};

const fetchSponsors = async ({ tier, limit }: FetchSponsorsOptions): Promise<Sponsor[]> => {
  const where: Where = {};
  if (tier && tier.length > 0) where.tier = { in: tier };

  const stringifiedQuery = stringify({ where, limit: limit ?? 12 }, { addQueryPrefix: true });

  return await payloadClientQuery<Sponsor[]>({
    url: '/api/sponsors',
    query: stringifiedQuery,
    method: 'GET',
    fallback: [],
  });
};

export { fetchSponsors };
