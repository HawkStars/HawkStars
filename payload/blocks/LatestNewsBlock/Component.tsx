'use client';

import React, { useEffect, useState } from 'react';
import type { LatestNewsBlock as LatestNewsBlockProps } from '@/payload-types';
import { LatestNewsBlockView, LatestNewsItem } from './LatestNewsBlockView';
import { fetchLatestHawkEvent, fetchLatestNews } from '@/lib/payload/client-side/queries/news';
import { Language } from '@/i18n/settings';

export const LatestNewsBlock: React.FC<LatestNewsBlockProps & { lng: Language }> = ({
  title,
  subtitle,
  source = 'news',
  newsType,
  eventType,
  linkLabel,
  sectionId,
  lng,
}) => {
  const [item, setItem] = useState<LatestNewsItem | null>(null);

  useEffect(() => {
    if (source === 'hawk_projects') {
      fetchLatestHawkEvent(eventType).then(setItem).catch(null);
    } else {
      fetchLatestNews(newsType).then(setItem).catch(null);
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
      lng={lng}
    />
  );
};
