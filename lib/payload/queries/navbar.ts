import { getPayloadConfig } from '../client';

const getNavbarQuery = async () => {
  const payload = await getPayloadConfig();
  const data = await payload.findGlobal({
    slug: 'header',
    depth: 1,
  });
  debugger;
  return data;
};

export { getNavbarQuery };
