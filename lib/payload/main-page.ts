import { Language } from '@/i18n/settings';
import { getPayloadConfig } from './server';
// import { cacheTag } from 'next/cache';
// import { MAIN_PAGE_CACHE_TAG } from '@/payload/globals/MainPage/hooks/revalidateMainPage';

const getMainPageInformation = async (lng: Language, opts?: { preview: boolean }) => {
  // cacheTag(MAIN_PAGE_CACHE_TAG);

  const payload = await getPayloadConfig();
  return await payload.findGlobal({
    slug: 'main-page',
    depth: 2,
    draft: opts?.preview || false,
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
export { getMainPageInformation };
