import { Language } from '@/i18n/settings';
import { findGlobalLocalized } from '../helpers';

const getNewsListHeader = async (lng: Language, preview?: boolean) =>
  findGlobalLocalized('news-list', lng, { preview });

export { getNewsListHeader };
