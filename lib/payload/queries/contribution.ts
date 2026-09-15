import * as Sentry from '@sentry/nextjs';
import { cacheLife, cacheTag } from 'next/cache';
import totalContributionValueQuery from '../endpoints/totalContributionValueQuery';
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
      and: [
        { is_confirmed: { equals: true } },
        {
          contribution_type: {
            in: ['OFFICE_CHAIR', 'AUDITORIUM_CHAIR', 'LOUNGE_CHAIR', 'SIMULATOR_CHAIR'],
          },
        },
      ],
    },
    select: {
      id: true,
      contribution_type: true,
      is_anonymous: true,
      donor: true,
      contribution_date: true,
    },
    limit: 0,
  });
  const { docs, hasNextPage, hasPrevPage, totalDocs, totalPages, nextPage } = contributions;
  return { docs, hasNextPage, hasPrevPage, totalDocs, totalPages, nextPage };
};

export const getContributionsQuery = async () => {
  'use cache';
  cacheLife('hours');
  cacheTag(CONTRIBUTION_CACHE_TAG);

  const payload = await getPayloadConfig();
  return await payload.find({
    collection: 'contributions',
    sort: '-contribution_date',
    limit: 100,
    depth: 0,
    where: { is_confirmed: { equals: true } },
  });
};

export const getSumContributions = async (): Promise<number> => {
  'use cache';
  cacheLife('hours');
  cacheTag(CONTRIBUTION_CACHE_TAG);

  try {
    const payload = await getPayloadConfig();
    const { sum } = await totalContributionValueQuery({ payload });
    return sum || 0;
  } catch (error) {
    Sentry.captureException(error);
    return 0;
  }
};
