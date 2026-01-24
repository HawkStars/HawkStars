import { Language } from '@/i18n/settings';
import { getPayloadConfig } from '../../server';

const getNewsListHeader = async (lng: Language) => {
  const payload = await getPayloadConfig();
  return await payload.findGlobal({
    slug: 'news-list',
    depth: 1,
    draft: false,
    locale: lng,
  });
};

export { getNewsListHeader };
