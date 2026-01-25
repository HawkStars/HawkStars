import { Language } from '@/i18n/settings';
import { getPayloadConfig } from '../server';
import { Page } from '@/payload-types';

const PAGES_COLLECTIONS = 'pages';

export const getSinglePageSlug = async (
  slug: string,
  locale: Language,
  opts?: { preview: boolean }
): Promise<Page | null> => {
  const payload = await getPayloadConfig();
  const page = await payload.find({
    collection: PAGES_COLLECTIONS,
    where: { slug: { equals: slug }, Visible: { equals: true } },
    locale,
    limit: 1,
    draft: opts?.preview || false,
  });
  return page ? page.docs[0] : null;
};
