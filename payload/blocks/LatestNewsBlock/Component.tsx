import React, { useCallback, useEffect, useState } from 'react';
import type { LatestNewsBlock as LatestNewsBlockProps } from '@/payload-types';
import type { Where } from 'payload';
import { getImagePayloadUrl } from '@/lib/image';
import { LatestNewsBlockView, type LatestNewsItem } from './LatestNewsBlockView';
import { stringify } from 'qs-esm';

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

async function fetchLatestNews(
  newsType?: LatestNewsBlockProps['newsType']
): Promise<LatestNewsItem | null> {
  const where: Where = {
    _status: { equals: 'published' },
  };

  if (newsType && newsType.length > 0) {
    where.type = { in: newsType };
  }

  const queryString = stringify(
    { where, limit: 1, sort: '-publishedAt' },
    { addQueryPrefix: true }
  );
  const data = await fetch(`/api/news?${queryString}`, {
    method: 'GET',
  });

  if (!data.ok) {
    console.error('Failed to fetch latest news:', data.statusText);
    return null;
  }

  const result = await data.json();
  const doc = result.docs[0] ?? null;
  if (!doc) return null;

  return {
    heading: doc.title,
    badge: doc.type ? newsTypeLabels[doc.type] || doc.type : null,
    date: doc.publishedAt ?? null,
    description: null,
    image: getImagePayloadUrl(doc.mainImage) ?? null,
    href: `/news/${doc.slug}`,
  };
}

async function fetchLatestHawkProject(
  eventType?: LatestNewsBlockProps['eventType']
): Promise<LatestNewsItem | null> {
  const where: Where = {};

  if (eventType && eventType.length > 0) where.type_event = { in: eventType };

  const queryString = stringify({ where, limit: 1, sort: '-createdAt' }, { addQueryPrefix: true });
  const data = await fetch(`/api/hawk_projects?${queryString}`, {
    method: 'GET',
  });

  if (!data.ok) {
    console.error('Failed to fetch latest Hawk project:', data.statusText);
    return null;
  }

  const result = await data.json();

  const doc = result.docs[0] ?? null;
  if (!doc) return null;

  return {
    heading: doc.heading,
    badge: doc.type_event ? eventTypeLabels[doc.type_event] || doc.type_event : null,
    date: null,
    description: doc.description ?? null,
    image: getImagePayloadUrl(doc.image) ?? null,
    href: `/events/${doc.slug}`,
  };
}

type LatestEvent = {
  heading: string;
  badge: string | null;
  date: string | null;
  description: string | null;
  image: { url: string; alt?: string } | null | undefined;
  href: string;
};

export const LatestNewsBlock: React.FC<LatestNewsBlockProps> = ({
  title,
  subtitle,
  source = 'news',
  newsType,
  eventType,
  linkLabel = 'Read more',
  sectionId,
}) => {
  const [item, setItem] = useState<LatestEvent | null>(null);

  const fetchData = useCallback(() => {
    if (source === 'hawk_projects') {
      fetchLatestHawkProject(eventType).then((data) => setItem(data));
    } else {
      fetchLatestNews(newsType).then((data) => setItem(data));
    }
  }, [source, newsType, eventType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
