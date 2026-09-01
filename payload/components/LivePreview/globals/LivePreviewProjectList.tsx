'use client';

import React from 'react';
import { useLivePreview } from '@payloadcms/live-preview-react';
import type { ProjectsList } from '@/payload-types';
import { Language } from '@/i18n/settings';
import SplitListComponent from '@/components/shared/SplitListComponent';
import ProjectCard from '@/components/projects/list/ProjectCard';
import HeroImpactStatsBlock from '@/components/projects/list/HeroImpactStatsBlock';
import type { SplitProjectsResult } from '@/lib/payload/queries/projects';
import { SITE_GET_URLS } from '@/utils/paths';

type LivePreviewData = {
  projectListInformation: ProjectsList;
  projects: SplitProjectsResult;
  translations: {
    upcoming: string;
    noUpcoming: string;
    viewAgenda: string;
    viewAgendaDescription: string;
    viewArchive: string;
    viewArchiveDescription: string;
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
      <HeroImpactStatsBlock
        {...projectListInformation}
        viewAgenda={translations.viewAgenda}
        archiveUrl={SITE_GET_URLS.projects_archive}
        viewArchive={translations.viewArchive}
      />
      <SplitListComponent
        items={projects}
        lng={lng}
        translations={translations}
        renderCard={(project, idx) => (
          <ProjectCard key={project.id} project={project} index={idx} lng={lng} />
        )}
      />
    </>
  );
};
