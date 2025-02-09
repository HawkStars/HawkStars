import { client } from '@/lib/sanityClient';
import groq from 'groq';

export type CHAIR_TYPES = 'OFFICE_CHAIR' | 'SIMULATOR_CHAIR' | 'LOUNGE_CHAIR' | 'AUDITORIUM_CHAIR';
export const getChairsContributionsQuery = groq`*[_type == "contribution" && contribution_type in ['OFFICE_CHAIR', 'SIMULATOR_CHAIR', 'LOUNGE_CHAIR', 'AUDITORIUM_CHAIR']]`;

// Add contribution

export const addContribution = async (contribution: unknown) => {
  const result = await client.create({ _type: 'contribution', contribution });
  return result;
};
