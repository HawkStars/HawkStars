import { Language } from '@/i18n/settings';
import { findGlobalLocalized } from '../helpers';

const getEventsListHeaderInfo = async (lng: Language) =>
  findGlobalLocalized('events-list', lng);

export { getEventsListHeaderInfo };
