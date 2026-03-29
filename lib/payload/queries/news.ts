import { Language } from '@/i18n/settings';
import { getPayloadConfig } from '../server';
import { News } from '@/payload-types';
import { PaginatedDocs } from 'payload';

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

export const getNewsQuery = async (
  page: number,
  locale: Language
): Promise<PaginatedDocs<News>> => {
  const payload = await getPayloadConfig();
  return await payload.find({
    collection: NEWS_COLLECTION,
    where: { status: { equals: 'published' } },
    locale,
    limit: 9,
    page,
    sort: '-publishedAt',
    depth: 1,
  });
};
