import { getPayloadConfig } from '../server';

const getHeaderQuery = async () => {
  const payload = await getPayloadConfig();
  return await payload.findGlobal({
    slug: 'header',
    draft: false,
    depth: 3,
    populate: {
      pages: {
        slug: true,
      },
      hawk_events: {
        slug: true,
      },
    },
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
