import { Language } from '@/i18n/settings';
import { findGlobalLocalized } from '../helpers';

const getProjectsListHeaderInfo = async (lng: Language) =>
  findGlobalLocalized('projects-list', lng);

export { getProjectsListHeaderInfo };
