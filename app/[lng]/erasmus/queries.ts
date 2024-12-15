import groq from 'groq';

/* Erasmus */
export const allEventsQuery = groq`*[_type == "erasmus"]`;
export const getSingleEventsQuery = groq`*[_type == "erasmus" && slug.current == $slug]`;
