import { Language } from '@/i18n/settings';
import { getPayloadConfig } from '../../server';

const getEventsListHeaderInfo = async (lng: Language) => {
  const payload = await getPayloadConfig();
  return await payload.findGlobal({
    slug: 'events-list',
    depth: 1,
    draft: false,
    locale: lng,
  });
};

export { getEventsListHeaderInfo };
