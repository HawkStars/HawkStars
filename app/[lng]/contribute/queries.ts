import groq from 'groq';

export const contributionsQuery = groq`*[_type == "contribution"]`;

// do for all or check if there is a way to group
