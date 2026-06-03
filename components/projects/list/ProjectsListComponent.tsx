import { HawkProject } from '@/payload-types';
import { LuArrowUpRight, LuCalendarDays } from 'react-icons/lu';
import { getCloudinaryBlurURL, getImagePayloadUrl } from '@/lib/image';
import { Button } from '@/components/ui/button';
import { transformUrl, urls } from '@/utils/paths';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { SplitProjectsResult } from '@/lib/payload/queries/projects';

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
  const image = getImagePayloadUrl(project.coverImage);
  const projectUrl = transformUrl(lng, `${urls.projects}/${project.slug}`);

  return (
    // Fixed height locks the card dimension before the image loads → no CLS.
    // Priority on the first card (above-fold LCP candidate).
    <Link
      href={projectUrl}
      className='group relative isolate h-72 overflow-hidden px-5 py-14 lg:h-96 lg:px-12 lg:py-24'
    >
      {image?.url && (
        <Image
          src={image.url}
          alt={project.heading ?? image.alt}
          fill
          className='object-cover'
          priority={index === 0}
          sizes='(max-width: 1024px) 100vw, 90vw'
          placeholder='blur'
          blurDataURL={getCloudinaryBlurURL(image.url)}
        />
      )}
      <div className='relative z-10 flex flex-col gap-7 transition-colors duration-300 ease-out lg:flex-row'>
        <div className='flex gap-1 text-2xl font-bold'>
          <span>/</span>
          <span>{String(index + 1).padStart(2, '0')}</span>
        </div>
        <div className='flex flex-1 flex-col gap-2.5'>
          <h3 className='text-2xl font-bold lg:text-4xl'>{project.heading}</h3>
          {project.startDate && (
            <div className='flex items-center gap-1.5 text-sm font-medium'>
              <LuCalendarDays className='size-4' />
              <span>{format(new Date(project.startDate), 'dd MMM yyyy')}</span>
            </div>
          )}
        </div>
        <div className='flex-1'>
          <div className='flex flex-col'>
            <div className='mt-2.5 h-0 overflow-hidden transition-all duration-300 ease-out group-hover:h-10'>
              <div>
                <Button
                  variant='outline'
                  size='lg'
                  className='dark w-fit opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100'
                >
                  {viewProjectLabel}
                  <LuArrowUpRight className='size-4' />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
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
      <div className='mx-6 flex flex-col items-start gap-4 rounded-xl border bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between lg:mx-12 lg:p-8'>
        <div>
          <p className='text-body_regular text-muted-foreground'>{viewAgendaDescription}</p>
        </div>
        <Button asChild size='lg' className='shrink-0'>
          <Link href={transformUrl(lng, urls.agenda)}>
            <LuCalendarDays className='size-4' />
            {viewAgenda}
          </Link>
        </Button>
      </div>

      {/* Upcoming Projects */}
      <section className='mx-6 lg:mx-12'>
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
      <section className='mx-6 lg:mx-12'>
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
