'use client';

import React from 'react';
import { useLivePreview } from '@payloadcms/live-preview-react';
import type { MainPage, Page } from '@/payload-types';
import RichText from '@/payload/components/RichText';
import { Language } from '@/i18n/settings';

type LivePreviewDataTypes = Page | MainPage;

type LivePreviewPageProps = {
  initialData: LivePreviewDataTypes;
  serverURL: string;
  lng: Language;
};

export const LivePreviewPage: React.FC<LivePreviewPageProps> = ({
  initialData,
  serverURL,
  lng,
}) => {
  const { data, isLoading } = useLivePreview<LivePreviewDataTypes>({
    initialData,
    serverURL,
    depth: 2,
  });

  if (isLoading) return <p>Loading...</p>;

  if (!data?.layout) return null;
  return <RichText data={data.layout} lng={lng} />;
};
