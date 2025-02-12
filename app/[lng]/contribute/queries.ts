import { client } from '@/lib/sanity/sanityClient';


export type CHAIR_TYPES = 'OFFICE_CHAIR' | 'SIMULATOR_CHAIR' | 'LOUNGE_CHAIR' | 'AUDITORIUM_CHAIR';

// Add contribution

export const addContribution = async (contribution: unknown) => {
  const result = await client.create({ _type: 'contribution', contribution });
  return result;
};
