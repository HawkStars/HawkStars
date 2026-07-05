'use client';

import React from 'react';
import { useLivePreview } from '@payloadcms/live-preview-react';
import type { HawkProject } from '@/payload-types';
import NewsSingleGallery from '@/components/news/single/NewsSingleGallery';
import ProjectsSingleHero from '@/components/projects/single/ProjectsSingleHero';
import SingleProjectObjectives from '@/components/projects/single/SingleProjectObjectives';
import SingleProjectPartners from '@/components/projects/single/SingleProjectPartners';
import SingleProjectPhases from '@/components/projects/single/SingleProjectPhases';
import SingleProjectReports from '@/components/projects/single/SingleProjectReports';

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
  const { partnersInformation, details, objectives, gallery } = data;

  return (
    <main>
      <ProjectsSingleHero {...data} />
      <SingleProjectPhases details={details} />
      <SingleProjectPartners partnersInformation={partnersInformation} />
      <SingleProjectObjectives objectives={objectives} />
      <SingleProjectReports {...data} />
      <NewsSingleGallery gallery={gallery} />
    </main>
  );
};
