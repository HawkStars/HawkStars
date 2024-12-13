import { client } from '@/sanity/lib/client';
import groq from 'groq';

export const contributionsQuery = groq`*[_type == "contribution"]`;

// do for all or check if there is a way to group

// Add contribution

export const addContribution = async (contribution: unknown) => {
  const result = await client.create({ _type: 'contribution', contribution });
};
