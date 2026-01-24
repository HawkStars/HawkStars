import { Language } from '@/i18n/settings';
import { getPayloadConfig } from '../../server';

const getProjectsListHeaderInfo = async (lng: Language) => {
  const payload = await getPayloadConfig();
  return await payload.findGlobal({
    slug: 'projects-list',
    depth: 1,
    draft: false,
    locale: lng,
  });
};

export { getProjectsListHeaderInfo };
