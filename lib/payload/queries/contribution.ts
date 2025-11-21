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

export const getSumContributions = async (): Promise<number> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/sum-contributions`);
    if (!response.ok) return 0;
    const data = await response.json();
    return (data.sum as number) || 0;
  } catch (error) {
    console.error('Error fetching sum of contributions:', error);
    return 0;
  }
};
