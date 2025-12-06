import { getPayloadConfig } from '../server';

const getHeaderQuery = async () => {
  const payload = await getPayloadConfig();
  return await payload.findGlobal({
    slug: 'header',
    depth: 2,
    draft: false,
  });
};

const getFooterQuery = async () => {
  const payload = await getPayloadConfig();
  return await payload.findGlobal({
    slug: 'footer',
    depth: 2,
    draft: false,
    populate: {
      pages: {
        slug: true,
      },
      hawk_projects: {
        slug: true,
      },
    },
  });
};

export { getHeaderQuery, getFooterQuery };
