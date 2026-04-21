'use client';

import React from 'react';
import { useLivePreview } from '@payloadcms/live-preview-react';
import type { HawkProject } from '@/payload-types';
import ProjectPage from '@/components/projects/ProjectPage';

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

  return <ProjectPage project={data} />;
};
