import groq from 'groq';

/* CURATOR */
export const allCuratorsQuery = groq`*[_type == "curator"]`;
export const getSingleCuratorQuery = groq`*[_type == "curator" && slug.current == $slug][0]`;

/* ARTWORK */
export const allArtwork = groq`*[_type == "art"]`;
export const getSingleArtwork = groq`*[_type == "art" && slug.current == $slug][0]`;
