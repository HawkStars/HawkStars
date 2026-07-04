import Image from 'next/image';

import { HawkProject, Media, Partner } from '@/payload-types';
import { getImagePayloadUrl } from '@/lib/image';
import ProjectsSingleHero from './single/ProjectsSingleHero';
import NewsSingleGallery from '../news/single/NewsSingleGallery';
import SingleProjectReports from './single/SingleProjectReports';
import SingleProjectPartners from './single/SingleProjectPartners';
import SingleProjectObjectives from './single/SingleProjectObjectives';
import SingleProjectPhases from './single/SingleProjectPhases';

interface ProjectPageProps {
  project: HawkProject;
}

export default function ProjectPage({ project }: ProjectPageProps) {
  const { partnersInformation, details } = project;

  const objectives = project.objectives;
  const gallery = project.gallery;

  return (
    <main>
      <ProjectsSingleHero {...project} />
      <SingleProjectPhases details={details} />
      <SingleProjectPartners partnersInformation={partnersInformation} />
      <SingleProjectObjectives objectives={objectives} />
      <SingleProjectReports {...project} />
      <NewsSingleGallery gallery={gallery} />
    </main>
  );
}
