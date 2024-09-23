import { client } from '@/sanity/lib/client';

export const getCurators = async () => {
  const curators = await client.fetch(`*[_type == "curator" && defined(slug.current)]`);
  return curators;
};
