import { stringify } from 'qs-esm';
import type { PaginatedDocs, Where } from 'payload';
import type { Sponsor, SponsorsBlock } from '@/payload-types';

type FetchSponsorsOptions = {
  tier?: SponsorsBlock['tier'];
  limit?: number | null;
};

const fetchSponsors = async ({ tier, limit }: FetchSponsorsOptions): Promise<Sponsor[]> => {
  const where: Where = {};
  if (tier && tier.length > 0) where.tier = { in: tier };

  const stringifiedQuery = stringify({ where, limit: limit ?? 12 }, { addQueryPrefix: true });

  try {
    const response = await fetch(`/api/sponsors${stringifiedQuery}`, { method: 'GET' });

    if (!response.ok) {
      throw new Error(`Failed to fetch sponsors: ${response.statusText}`);
    }

    const data: PaginatedDocs<Sponsor> = await response.json();
    return data.docs || [];
  } catch (error) {
    console.error('Error fetching sponsors:', error);
    return [];
  }
};

export { fetchSponsors };
