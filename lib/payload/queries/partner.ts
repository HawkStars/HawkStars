import { getPayloadConfig } from '../server';
// import { cacheLife, cacheTag } from 'next/cache';
// import { PARTNER_CACHE_TAG } from '@/payload/collections/Partner';

const getPartnersQuery = async () => {
  // 'use cache';
  // cacheLife('weeks');
  // cacheTag(PARTNER_CACHE_TAG);

  const payload = await getPayloadConfig();
  return await payload.find({
    collection: 'partners',
    sort: '-createdAt',
    limit: 1000,
    depth: 1,
  });
};

export { getPartnersQuery };
