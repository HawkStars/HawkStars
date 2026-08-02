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
import { useLanguageCookie } from '@/utils/contexts/AppProvider';

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

  const lng = useLanguageCookie();

  if (!data) return null;
  const { partnersInformation, details, objectives, gallery } = data;

  return (
    <>
      <ProjectsSingleHero {...data} lng={lng} />
      <SingleProjectPhases details={details} />
      <SingleProjectPartners partnersInformation={partnersInformation} lng={lng} />
      <SingleProjectObjectives objectives={objectives} lng={lng} />
      <SingleProjectReports {...data} lng={lng} />
      <NewsSingleGallery gallery={gallery} />
    </>
  );
};
