import { Language } from '@/i18n/settings';
import { getPayloadConfig } from './server';
import { cacheLife, cacheTag } from 'next/cache';
import { MAIN_PAGE_CACHE_TAG } from '@/payload/globals/MainPage/hooks/revalidateMainPage';

const findMainPage = async (lng: Language, preview: boolean) => {
  const payload = await getPayloadConfig();
  return await payload.findGlobal({
    slug: 'main-page',
    depth: 2,
    draft: preview,
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

const getMainPageInfo = async (lng: Language) => {
  'use cache';
  cacheTag(MAIN_PAGE_CACHE_TAG);
  cacheLife('hours');

  return findMainPage(lng, false);
};

const getMainPageInformation = async (lng: Language) => {
  return await getMainPageInfo(lng);
};

const getMainPageInformationPreview = async (lng: Language) => {
  return await findMainPage(lng, true);
};

export { getMainPageInformation, getMainPageInformationPreview };
