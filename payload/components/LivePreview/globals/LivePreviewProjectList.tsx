'use client';

import React from 'react';
import { useLivePreview } from '@payloadcms/live-preview-react';
import type { ProjectsList } from '@/payload-types';
import { Language } from '@/i18n/settings';
import { SplitProjectsResult } from '@/lib/payload/queries/event';
import ProjectsListComponent from '@/components/projects/list/ProjectsListComponent';
import HeroImpactStatsBlock from '@/components/projects/list/HeroImpactStatsBlock';

type LivePreviewData = {
  projectListInformation: ProjectsList;
  projects: SplitProjectsResult;
  translations: {
    upcomingProjects: string;
    pastProjects: string;
    noUpcomingProjects: string;
    noPastProjects: string;
    viewAgenda: string;
    viewAgendaDescription: string;
    viewProject: string;
  };
};

type LivePreviewProjectListProps = {
  initialData: LivePreviewData;
  serverURL: string;
  lng: Language;
};

export const LivePreviewProjectList: React.FC<LivePreviewProjectListProps> = ({
  initialData,
  serverURL,
  lng,
}) => {
  const { data } = useLivePreview<LivePreviewData>({
    initialData,
    serverURL,
    depth: 2,
  });

  if (!data) return null;
  const { projectListInformation, projects, translations } = data;

  return (
    <>
      <HeroImpactStatsBlock {...projectListInformation} />
      <ProjectsListComponent projects={projects} lng={lng} translations={translations} />
    </>
  );
};
