import groq from 'groq';

/* Events */
export const getSingleEventsQuery = groq`*[_type == "event" && slug.current == $slug]`;

export const firstPageEventsQuery = groq`*[_type == "event"] | order(_id) [0...100]`;
export const nextPageEventsQuery = groq`*[_type == "event" && _id > $lastId] | order(_id) [0...100]`;
export const firstPageEventByTypeQuery = groq`*[_type == "event" && type_event == $type] | order(_id) [0...100]`;
export const nextPageEventByTypeQuery = groq`*[_type == "event" && type_event == $type && _id > $lastId] | order(_id) [0...100]`;
