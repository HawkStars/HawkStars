import { Language } from '@/i18n/settings';
import { getPayloadConfig } from '../server';
// import { cacheLife, cacheTag } from 'next/cache';
// import { HEADER_CACHE_TAG } from '@/payload/globals/Header/hooks/revalidateHeader';
// import { FOOTER_CACHE_TAG } from '@/payload/globals/Footer/hooks/revalidateFooter';

const getHeaderQuery = async (lng: Language) => {
  // 'use cache';
  // cacheLife('weeks');
  // cacheTag(HEADER_CACHE_TAG);

  const payload = await getPayloadConfig();
  return await payload.findGlobal({
    slug: 'header',
    depth: 2,
    draft: false,
    locale: lng,
  });
};

const getFooterQuery = async (lng: Language) => {
  // 'use cache';
  // cacheLife('weeks');
  // cacheTag(FOOTER_CACHE_TAG);

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
