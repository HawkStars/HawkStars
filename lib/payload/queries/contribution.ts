import totalContributioValueQuery from '../endpoints/totalContributioValueQuery';
import { getPayloadConfig } from '../server';

export const getChairsContributionsQuery = async () => {
  const payload = await getPayloadConfig();
  const contributions = await payload.find({
    collection: 'contributions',
    where: {
      contribution_type: {
        in: ['OFFICE_CHAIR', 'AUDITORIUM_CHAIR', 'LOUNGE_CHAIR', 'SIMULATOR_CHAIR'],
      },
    },
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
    console.error('Error fetching sum of contributions:', error);
    return 0;
  }
};
