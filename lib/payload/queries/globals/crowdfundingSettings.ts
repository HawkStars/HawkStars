import { Language } from '@/i18n/settings';
import { getPayloadConfig } from '../../server';

const getCrowdfundingSettings = async (lng: Language) => {
  const payload = await getPayloadConfig();
  return await payload.findGlobal({
    slug: 'crowdfunding-settings',
    depth: 0,
    locale: lng,
  });
};

export { getCrowdfundingSettings };
