'use client';

import React from 'react';
import { useLivePreview } from '@payloadcms/live-preview-react';
import type { News, NewsList } from '@/payload-types';
import { PaginatedDocs } from 'payload';
import { Language } from '@/i18n/settings';
import NewsListComponent from '@/components/news/list/NewsListComponent';
import NewsListHeader from '@/components/news/list/NewsListHeader';

type LivePreviewData = {
  newsListHeader: NewsList;
  news: PaginatedDocs<News>;
};

type LivePreviewNewsListProps = {
  initialData: LivePreviewData;
  serverURL: string;
  lng: Language;
};

export const LivePreviewNewsList: React.FC<LivePreviewNewsListProps> = ({
  initialData,
  serverURL,
  lng,
}) => {
  const { data } = useLivePreview<{
    newsListHeader: NewsList;
    news: PaginatedDocs<News>;
  }>({
    initialData,
    serverURL,
    depth: 2,
  });

  if (!data) return null;
  const { newsListHeader, news } = data;

  return (
    <>
      <NewsListHeader title={newsListHeader?.title || 'News'} subtitle={newsListHeader?.subtitle} />
      <NewsListComponent news={news} lng={lng} />
    </>
  );
};
