import { Language } from '@/i18n/settings';
import { getPayloadConfig } from '../../server';

const getNewsListHeader = async (lng: Language, preview?: boolean) => {
  const payload = await getPayloadConfig();
  return await payload.findGlobal({
    slug: 'news-list',
    depth: 1,
    draft: preview || false,
    locale: lng,
  });
};

export { getNewsListHeader };
