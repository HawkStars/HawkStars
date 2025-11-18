import { getPayloadConfig } from '../client';

const getHeaderQuery = async () => {
  const payload = await getPayloadConfig();
  return await payload.findGlobal({
    slug: 'header',
    draft: false,

    depth: 2,
  });
};

const getFooterQuery = async () => {
  const payload = await getPayloadConfig();
  return await payload.findGlobal({
    slug: 'footer',
    depth: 2,
    draft: false,
  });
};

export { getHeaderQuery, getFooterQuery };
