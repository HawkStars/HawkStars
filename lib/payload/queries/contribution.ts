import * as Sentry from '@sentry/nextjs';
import { cacheLife, cacheTag } from 'next/cache';
import totalContributioValueQuery from '../endpoints/totalContributioValueQuery';
import { getPayloadConfig } from '../server';
import { CONTRIBUTION_CACHE_TAG } from '@/payload/collections/Contribution';

// The only contribution query that was left uncached, which is what kept
// /contribute from prerendering while /transparency (same collection, cached
// queries) was fine.
export const getChairsContributionsQuery = async () => {
  'use cache';
  cacheLife('hours');
  cacheTag(CONTRIBUTION_CACHE_TAG);

  const payload = await getPayloadConfig();
  const contributions = await payload.find({
    collection: 'contributions',
    where: {
      contribution_type: {
        in: ['OFFICE_CHAIR', 'AUDITORIUM_CHAIR', 'LOUNGE_CHAIR', 'SIMULATOR_CHAIR'],
      },
    },
    limit: 0,
  });
  const { docs, hasNextPage, hasPrevPage, totalDocs, totalPages, nextPage } = contributions;
  return { docs, hasNextPage, hasPrevPage, totalDocs, totalPages, nextPage };
};

export const getContributionsQuery = async () => {
  const payload = await getPayloadConfig();
  return await payload.find({
    collection: 'contributions',
    sort: '-contribution_date',
    limit: 100,
  });
};

export const getSumContributions = async (): Promise<number> => {
  try {
    const payload = await getPayloadConfig();
    const response = await totalContributioValueQuery({ payload });
    if (!response.ok) return 0;
    const data = await response.json();
    return (data.sum as number) || 0;
  } catch (error) {
    Sentry.captureException(error);
    return 0;
  }
};
