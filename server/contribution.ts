import groq from 'groq';

export const totalMoneyGatheredQuery = groq`*[_type=="contribution && is_confirmed == true"]{ count(value)}`;
