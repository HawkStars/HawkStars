import groq from 'groq';

export const allCuratorsQuery = groq`*[_type == "curator"]`;
