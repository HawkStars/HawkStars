import type { Sponsor, SponsorsBlock } from '@/payload-types';
import type { Where } from 'payload';
import { cacheLife, cacheTag } from 'next/cache';
import { getPayloadConfig } from '../server';
import { SPONSOR_CACHE_TAG } from '@/payload/collections/Sponsor';

type SponsorQueryOptions = {
  tier?: SponsorsBlock['tier'];
  limit?: number | null;
};

/**
 * Server-side replacement for `lib/payload/client-side/queries/sponsors.ts`.
 *
 * The block used to `useEffect`-fetch this over REST after hydration: an extra round
 * trip per visitor, an uncached Mongo read behind it, and content that was invisible
 * to crawlers because the block rendered `null` until the request resolved.
 */
const getSponsorsQuery = async ({ tier, limit }: SponsorQueryOptions = {}): Promise<Sponsor[]> => {
  'use cache';
  cacheLife('hours');
  cacheTag(SPONSOR_CACHE_TAG);

  const where: Where = {};
  if (tier && tier.length > 0) where.tier = { in: tier };

  const payload = await getPayloadConfig();
  const result = await payload.find({
    collection: 'sponsors',
    where,
    limit: limit ?? 12,
    depth: 1,
  });

  return result.docs;
};

export { getSponsorsQuery };
