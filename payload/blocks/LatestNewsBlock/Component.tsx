import type { LatestNewsBlock as LatestNewsBlockProps } from '@/payload-types';
import { LatestNewsBlockView, LatestNewsItem } from './LatestNewsBlockView';
import { getLatestEventForBlock, getLatestNewsForBlock } from '@/lib/payload/queries/blocks';
import { getImagePayloadUrl } from '@/lib/image';
import { Language } from '@/i18n/settings';
import { NewsTypeLabels } from '@/components/news/constants';

// Server component. The client version fetched after hydration, rendered `null` until
// it resolved (invisible to crawlers, a layout shift for users), passed no locale, and
// its `.catch(null)` did nothing — `Promise.catch` ignores a non-callable argument, so
// a failed request was still an unhandled rejection.
export const LatestNewsBlock = async ({
  title,
  subtitle,
  source = 'news',
  newsType,
  eventType,
  linkLabel = 'Read more',
  sectionId,
  lng,
}: LatestNewsBlockProps & { lng: Language }) => {
  let item: LatestNewsItem | null = null;

  if (source === 'hawk_projects') {
    const event = await getLatestEventForBlock(lng, eventType);
    if (event) {
      const image = getImagePayloadUrl(event.image);
      item = {
        heading: event.heading ?? '',
        badge: event.type_event ?? null,
        description: event.description ?? null,
        image: image ?? null,
        href: `/events/${event.slug}`,
        date: event.date ?? null,
      };
    }
  } else {
    const news = await getLatestNewsForBlock(lng, newsType);
    if (news) {
      item = {
        heading: news.title ?? '',
        badge: news.type ? (NewsTypeLabels[news.type] ?? news.type) : null,
        description: null,
        image: getImagePayloadUrl(news.mainImage) ?? null,
        href: `/news/${news.slug}`,
        date: news.publishedAt ?? null,
      };
    }
  }

  if (!item) return null;

  return (
    <LatestNewsBlockView
      title={title}
      subtitle={subtitle}
      linkLabel={linkLabel}
      sectionId={sectionId}
      item={item}
    />
  );
};
