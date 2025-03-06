import groq from 'groq';

/* Events */
export const getSingleEventsQuery = groq`*[_type == "events" && slug.current == $slug]`;

export const firstPageEventsQuery = groq`*[_type == "events"] | order(_id) [0...100]`;
export const nextPageEventsQuery = groq`*[_type == "events" && _id > $lastId] | order(_id) [0...100]`;
export const firstPageEventByTypeQuery = groq`*[_type == "events" && type_event == $type] | order(_id) [0...100]`;
export const nextPageEventByTypeQuery = groq`*[_type == "events" && type_event == $type && _id > $lastId] | order(_id) [0...100]`;
