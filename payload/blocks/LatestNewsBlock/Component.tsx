'use client';

import React, { useEffect, useState } from 'react';
import type { LatestNewsBlock as LatestNewsBlockProps } from '@/payload-types';
import { LatestNewsBlockView, LatestNewsItem } from './LatestNewsBlockView';
import { fetchLatestHawkEvent, fetchLatestNews } from '@/lib/payload/client-side/queries/news';

export const LatestNewsBlock: React.FC<LatestNewsBlockProps> = ({
  title,
  subtitle,
  source = 'news',
  newsType,
  eventType,
  linkLabel = 'Read more',
  sectionId,
}) => {
  const [item, setItem] = useState<LatestNewsItem | null>(null);

  useEffect(() => {
    if (source === 'hawk_projects') {
      fetchLatestHawkEvent(eventType).then(setItem);
    } else {
      fetchLatestNews(newsType).then(setItem);
    }
  }, [source, newsType, eventType]);

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
