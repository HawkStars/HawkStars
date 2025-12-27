import { Language } from '@/i18n/settings';
import { getPayloadConfig } from './server';

const getMainPageInformation = async (lng: Language) => {
  const payload = await getPayloadConfig();
  return await payload.findGlobal({
    slug: 'main-page',
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
export { getMainPageInformation };
