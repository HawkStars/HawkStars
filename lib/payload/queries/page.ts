import { Language } from '@/i18n/settings';
import { getPayloadConfig } from '../client';
import { Page } from '@/payload-types';

const PAGES_COLLECTIONS = 'pages';

export const getSinglePageSlug = async (slug: string, locale: Language): Promise<Page | null> => {
  const payload = await getPayloadConfig();
  const page = await payload.find({
    collection: PAGES_COLLECTIONS,
    where: { slug: { equals: slug } },
    locale,
    limit: 1,
  });
  return page ? page.docs[0] : null;
};
