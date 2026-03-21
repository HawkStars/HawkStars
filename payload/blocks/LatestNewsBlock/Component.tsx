import React from 'react';
import type { LatestNewsBlock as LatestNewsBlockProps } from '@/payload-types';
import type { Where } from 'payload';
import { getPayloadConfig } from '@/lib/payload/server';
import { getImagePayloadUrl } from '@/lib/image';
import { LatestNewsBlockView, type LatestNewsItem } from './LatestNewsBlockView';

const newsTypeLabels: Record<string, string> = {
  blog: 'Blog',
  news: 'News',
  press_release: 'Press Release',
  announcement: 'Announcement',
  other: 'Other',
};

const eventTypeLabels: Record<string, string> = {
  erasmus: 'Erasmus +',
  local_event: 'Local Event',
  international_event: 'International Event',
  other: 'Other',
};

async function fetchLatestNews(newsType?: LatestNewsBlockProps['newsType']): Promise<LatestNewsItem | null> {
  const payload = await getPayloadConfig();

  const where: Where = {
    _status: { equals: 'published' },
  };

  if (newsType && newsType.length > 0) {
    where.type = { in: newsType };
  }

  const result = await payload.find({
    collection: 'news',
    where,
    sort: '-publishedAt',
    limit: 1,
  });

  const doc = result.docs[0] ?? null;
  if (!doc) return null;

  return {
    heading: doc.title,
    badge: doc.type ? (newsTypeLabels[doc.type] || doc.type) : null,
    date: doc.publishedAt ?? null,
    description: null,
    image: getImagePayloadUrl(doc.mainImage) ?? null,
    href: `/news/${doc.slug}`,
  };
}

async function fetchLatestHawkProject(eventType?: LatestNewsBlockProps['eventType']): Promise<LatestNewsItem | null> {
  const payload = await getPayloadConfig();

  const where: Where = {};

  if (eventType && eventType.length > 0) {
    where.type_event = { in: eventType };
  }

  const result = await payload.find({
    collection: 'hawk_projects',
    where,
    sort: '-createdAt',
    limit: 1,
  });

  const doc = result.docs[0] ?? null;
  if (!doc) return null;

  return {
    heading: doc.heading,
    badge: doc.type_event ? (eventTypeLabels[doc.type_event] || doc.type_event) : null,
    date: null,
    description: doc.description ?? null,
    image: getImagePayloadUrl(doc.image) ?? null,
    href: `/events/${doc.slug}`,
  };
}

export const LatestNewsBlock: React.FC<LatestNewsBlockProps> = async ({
  title,
  subtitle,
  source = 'news',
  newsType,
  eventType,
  linkLabel = 'Read more',
  sectionId,
}) => {
  const item =
    source === 'hawk_projects'
      ? await fetchLatestHawkProject(eventType)
      : await fetchLatestNews(newsType);

  if (!item) {
    return null;
  }

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
