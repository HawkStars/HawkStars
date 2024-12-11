import groq from 'groq';

export const allCuratorsQuery = groq`*[_type == "curator"]`;
export const getSingleCuratorQuery = groq`*[_type == "curator" && slug == $slug]`;

// art piece
export const allArtwork = groq`*[_type == "art"]`;
export const getSingleArtwork = groq`*[_type == "art" && slug == $slug]`;
