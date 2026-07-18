import { Language } from '@/i18n/settings';
import { findGlobalLocalized } from '../helpers';

const getCrowdfundingSettings = async (lng: Language, preview?: boolean) =>
  findGlobalLocalized('crowdfunding-settings', lng, { preview });

export { getCrowdfundingSettings };
