'use client';

import React from 'react';
import { useLivePreview } from '@payloadcms/live-preview-react';
import type { Page } from '@/payload-types';
import RichText from '@/payload/components/RichText';

type LivePreviewPageProps = {
  initialData: Page;
  serverURL: string;
};

export const LivePreviewPage: React.FC<LivePreviewPageProps> = ({ initialData, serverURL }) => {
  const { data } = useLivePreview<Page>({
    initialData,
    serverURL,
    depth: 2,
  });

  if (!data?.layout) return null;

  return <RichText data={data.layout} />;
};
