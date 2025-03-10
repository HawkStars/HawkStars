import groq from 'groq';

/* Events */
export const getSingleEventsQuery = groq`*[_type == "hawkEvent" && slug.current == $slug][0]`;

export const countEventsQuery = groq`count(*[_type == "hawkEvent"])`;
export const firstPageEventsQuery = groq`*[_type == "hawkEvent"] { _id, _updatedAt, name, slug, type_event, image } | order(_id) [0...10]`;
export const nextPageEventsQuery = groq`*[_type == "hawkEvent" && 
    (publishedAt > $lastPublishedAt || (publishedAt == $lastPublishedAt && _id > $lastId))] { _id, _updatedAt, name, slug, type_event, image } 
    | order(_id) [0...10]`;
export const firstPageEventByTypeQuery = groq`*[_type == "hawkEvent" && type_event == $type] | order(_id) [0...10]`;
export const nextPageEventByTypeQuery = groq`*[_type == "hawkEvent" && type_event == $type && 
    (publishedAt > $lastPublishedAt || (publishedAt == $lastPublishedAt && _id > $lastId))] 
    | order(_id) [0...10]`;
