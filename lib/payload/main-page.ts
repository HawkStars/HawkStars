import { Language } from '@/i18n/settings';
import { getPayloadConfig } from './server';
import { cacheLife, cacheTag } from 'next/cache';
import { MAIN_PAGE_CACHE_TAG } from '@/payload/globals/MainPage/hooks/revalidateMainPage';

const getMainPageInfo = async (lng: Language, opts?: { preview: boolean }) => {
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

const getMainPageInformation = async (lng: Language) => {
  'use cache';
  cacheLife('hours');
  cacheTag(MAIN_PAGE_CACHE_TAG);
  return await getMainPageInfo(lng);
};

const getMainPageInformationPreview = async (lng: Language) => {
  return await getMainPageInfo(lng, { preview: true });
};

export { getMainPageInformation, getMainPageInformationPreview };
