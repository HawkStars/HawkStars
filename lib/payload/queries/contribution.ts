import { getPayloadConfig } from '../client';

export const getChairsContributionsQuery = async () => {
  const payload = await getPayloadConfig();
  const contributions = await payload.find({ collection: 'contributions', limit: 100 });
  const { docs, hasNextPage, hasPrevPage, totalDocs, totalPages, nextPage } = contributions;
  return { docs, hasNextPage, hasPrevPage, totalDocs, totalPages, nextPage };
};

export const countContributionQuery = async () => {
  const payload = await getPayloadConfig();
  const count = await payload.count({ collection: 'contributions' });
  return count;
};
