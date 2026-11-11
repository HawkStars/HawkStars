import * as Sentry from '@sentry/nextjs';
import { cacheLife, cacheTag } from 'next/cache';
import totalContributionValueQuery from '../endpoints/totalContributionValueQuery';
import { getPayloadConfig } from '../server';
import { CONTRIBUTION_CACHE_TAG } from '@/payload/collections/Contribution';
import {
  CONTRIBUTION_TYPE_ORDER,
  type ContributionType,
  type ContributionTypeTotal,
} from '@/components/transparency/config';

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

// The table renders <LandingPagination>, but this took no page argument and
// always returned the first 100 — so beyond 100 confirmed contributions the
// "next" link changed the URL and showed the same rows, and older contributions
// were unreachable on a public accountability page.
export const CONTRIBUTIONS_PAGE_LIMIT = 100;

export const getContributionsQuery = async (page = 1) => {
  'use cache';
  cacheLife('hours');
  cacheTag(CONTRIBUTION_CACHE_TAG);

  const payload = await getPayloadConfig();
  return await payload.find({
    collection: 'contributions',
    sort: '-contribution_date',
    limit: CONTRIBUTIONS_PAGE_LIMIT,
    page,
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

/**
 * Confirmed totals per contribution type, for the transparency progress bar. Projects
 * only `value` and `contribution_type`, like `totalContributionValueQuery`, and returns
 * every known type in display order (zero when nothing has come in yet).
 */
export const getContributionTotalsByType = async (): Promise<ContributionTypeTotal[]> => {
  'use cache';
  cacheLife('hours');
  cacheTag(CONTRIBUTION_CACHE_TAG);

  try {
    const payload = await getPayloadConfig();
    const { docs } = await payload.find({
      collection: 'contributions',
      where: { is_confirmed: { equals: true } },
      limit: 0,
      depth: 0,
      select: { value: true, contribution_type: true },
    });

    const totals = new Map<ContributionType, ContributionTypeTotal>(
      CONTRIBUTION_TYPE_ORDER.map((type) => [type, { type, sum: 0, count: 0 }])
    );
    for (const doc of docs) {
      const entry = totals.get(doc.contribution_type);
      if (!entry) continue;
      entry.sum += doc.value || 0;
      entry.count += 1;
    }
    return [...totals.values()];
  } catch (error) {
    Sentry.captureException(error);
    return CONTRIBUTION_TYPE_ORDER.map((type) => ({ type, sum: 0, count: 0 }));
  }
};
