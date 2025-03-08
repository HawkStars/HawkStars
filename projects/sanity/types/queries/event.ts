import groq from 'groq';

/* Events */
export const getSingleEventsQuery = groq`*[_type == "hawkEvent" && slug.current == $slug]`;

export const firstPageEventsQuery = groq`*[_type == "hawkEvent"] | order(_id) [0...100]`;
export const nextPageEventsQuery = groq`*[_type == "hawkEvent" && _id > $lastId] | order(_id) [0...100]`;
export const firstPageEventByTypeQuery = groq`*[_type == "hawkEvent" && type_event == $type] | order(_id) [0...100]`;
export const nextPageEventByTypeQuery = groq`*[_type == "hawkEvent" && type_event == $type && _id > $lastId] | order(_id) [0...100]`;
