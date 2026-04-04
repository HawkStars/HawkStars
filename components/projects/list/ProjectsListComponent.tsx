import { HawkProject, Media } from '@/payload-types';
import { ArrowUpRight, CalendarDays } from 'lucide-react';
import { getImagePayloadUrl } from '@/lib/image';
import { Button } from '@/components/ui/button';
import { transformUrl, urls } from '@/utils/paths';
import Link from 'next/link';
import { format } from 'date-fns';
import { SplitProjectsResult } from '@/lib/payload/queries/event';

type ProjectsListProps = {
  projects: SplitProjectsResult;
  lng: string;
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

type ProjectCardProps = {
  project: HawkProject;
  index: number;
  lng: string;
  viewProjectLabel: string;
};

const ProjectCard = ({ project, index, lng, viewProjectLabel }: ProjectCardProps) => {
  const image = getImagePayloadUrl(project.image);
  const projectUrl = transformUrl(lng, `${urls.projects}/${project.slug}`);

  return (
    <Link
      href={projectUrl}
      className='group relative isolate min-h-72 bg-cover bg-center px-5 py-14 lg:px-12 lg:py-24'
      style={{
        backgroundImage: `url(${(image as Media)?.url})`,
      }}
    >
      <div className='relative z-10 flex flex-col gap-7 text-white/80 transition-colors duration-300 ease-out group-hover:text-white lg:flex-row'>
        <div className='flex gap-1 text-2xl font-bold'>
          <span>/</span>
          <span>{String(index + 1).padStart(2, '0')}</span>
        </div>
        <div className='flex flex-1 flex-col gap-2.5'>
          <h3 className='text-2xl font-bold lg:text-4xl'>{project.heading}</h3>
          <p className='text-sm font-medium uppercase'>{project.subheading}</p>
          {project.date && (
            <div className='flex items-center gap-1.5 text-sm font-medium'>
              <CalendarDays className='size-4' />
              <span>{format(new Date(project.date), 'dd MMM yyyy')}</span>
            </div>
          )}
        </div>
        <div className='flex-1'>
          <div className='flex flex-col'>
            <p>{project.description}</p>
            <div className='mt-2.5 h-0 overflow-hidden transition-all duration-300 ease-out group-hover:h-10'>
              <div>
                <Button
                  variant='outline'
                  size='lg'
                  className='dark w-fit opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100'
                >
                  {viewProjectLabel}
                  <ArrowUpRight className='size-4' />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='absolute inset-0 z-0 bg-black/80 backdrop-blur-xs transition-all duration-300 ease-out group-hover:bg-black/50 group-hover:backdrop-blur-none' />
    </Link>
  );
};

const ProjectsListComponent = ({ projects, lng, translations }: ProjectsListProps) => {
  const { upcoming, past } = projects || {};
  const {
    upcomingProjects,
    pastProjects,
    noUpcomingProjects,
    noPastProjects,
    viewAgenda,
    viewAgendaDescription,
    viewProject,
  } = translations;

  return (
    <div className='flex flex-col gap-16'>
      {/* Agenda CTA */}
      <div className='flex flex-col items-start gap-4 rounded-xl border bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <p className='text-body_regular text-muted-foreground'>{viewAgendaDescription}</p>
        </div>
        <Button asChild size='lg' className='shrink-0'>
          <Link href={transformUrl(lng, urls.agenda)}>
            <CalendarDays className='size-4' />
            {viewAgenda}
          </Link>
        </Button>
      </div>

      {/* Upcoming Projects */}
      <section>
        <h2 className='text-h2_semibold mb-6'>{upcomingProjects}</h2>
        {upcoming.length === 0 ? (
          <p className='text-muted-foreground text-body_regular'>{noUpcomingProjects}</p>
        ) : (
          <div className='flex flex-col gap-5'>
            {upcoming.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={idx}
                lng={lng}
                viewProjectLabel={viewProject}
              />
            ))}
          </div>
        )}
      </section>

      {/* Past Projects */}
      <section>
        <h2 className='text-h2_semibold mb-6'>{pastProjects}</h2>
        {past.length === 0 ? (
          <p className='text-muted-foreground text-body_regular'>{noPastProjects}</p>
        ) : (
          <div className='flex flex-col gap-5'>
            {past.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={idx}
                lng={lng}
                viewProjectLabel={viewProject}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProjectsListComponent;
