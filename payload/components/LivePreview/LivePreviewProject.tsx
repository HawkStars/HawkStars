'use client';

import React from 'react';
import { useLivePreview } from '@payloadcms/live-preview-react';
import type { HawkProject, News } from '@/payload-types';
import { getImagePayloadUrl } from '@/lib/image';
import Post from '@/components/blog/Post';

type LivePreviewProjectProps = {
  initialData: HawkProject;
  serverURL: string;
};

export const LivePreviewProject: React.FC<LivePreviewProjectProps> = ({
  initialData,
  serverURL,
}) => {
  const { data } = useLivePreview<HawkProject>({
    initialData,
    serverURL,
    depth: 2,
  });

  if (!data) return null;

  const image = getImagePayloadUrl(data.image);

  return (
    <Post
      content={data.page_content || undefined}
      title={data.heading}
      image={image?.url || ''}
      pubDate={new Date(data.updatedAt)}
      description={data.description || undefined}
    />
  );
};
