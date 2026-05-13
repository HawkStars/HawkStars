import { Language } from '@/i18n/settings';
import { getPayloadConfig } from '../../server';

const getCrowdfundingSettings = async (lng: Language, preview?: boolean) => {
  const payload = await getPayloadConfig();
  return await payload.findGlobal({
    slug: 'crowdfunding-settings',
    depth: 1,
    locale: lng,
    draft: preview || false,
  });
};

export { getCrowdfundingSettings };
