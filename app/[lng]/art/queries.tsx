import { groq } from 'next-sanity';

const CURATOR_SLUG_QUERY = groq`*[_type == "curator" && defined(slug.current)]`[0];

export { CURATOR_SLUG_QUERY };
