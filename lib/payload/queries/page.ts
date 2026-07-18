import { Language } from '@/i18n/settings';
import { Page } from '@/payload-types';
import { findPublishedBySlug } from './helpers';

const PAGES_COLLECTION = 'pages';

export const getSinglePageSlug = async (
  slug: string,
  locale: Language,
  opts?: { preview: boolean }
): Promise<Page | null> =>
  findPublishedBySlug(PAGES_COLLECTION, slug, locale, { preview: opts?.preview });
