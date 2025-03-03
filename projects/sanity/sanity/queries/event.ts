import groq from 'groq';

/* Events */
export const allEventsQuery = groq`*[_type == "events"]`;
export const allEventsErasmusQuery = groq`*[_type == "events" && event_type == "erasmus"]`;
export const getSingleEventsQuery = groq`*[_type == "events" && slug.current == $slug]`;
