import { Language } from '@/i18n/settings';
import { getPayloadConfig } from '../server';
import { News } from '@/payload-types';

const NEWS_COLLECTION = 'news';

export const getSingleNewsSlug = async (
  slug: string,
  locale: Language,
  opts?: { preview: boolean }
): Promise<News | null> => {
  const payload = await getPayloadConfig();
  const news = await payload.find({
    collection: NEWS_COLLECTION,
    where: { slug: { equals: slug } },
    locale,
    limit: 1,
    draft: opts?.preview || false,
  });
  return news ? news.docs[0] : null;
};
