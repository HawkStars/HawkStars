import { Language } from '@/i18n/settings';
import { getPayloadConfig } from '../server';

const getHeaderQuery = async (lng: Language) => {
  const payload = await getPayloadConfig();
  return await payload.findGlobal({
    slug: 'header',
    depth: 2,
    draft: false,
    locale: lng,
  });
};

const getFooterQuery = async (lng: Language) => {
  const payload = await getPayloadConfig();
  return await payload.findGlobal({
    slug: 'footer',
    depth: 2,
    draft: false,
    locale: lng,
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
