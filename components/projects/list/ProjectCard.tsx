import { HawkProject } from '@/payload-types';
import { LuCalendarDays } from 'react-icons/lu';
import { getImagePayloadUrl } from '@/lib/image';
import { transformUrl, urls } from '@/utils/paths';
import Link from 'next/link';
import { ImageMedia } from '@/payload/components/Media';
import { format } from 'date-fns';

type ProjectCardProps = {
  project: HawkProject;
  index: number;
  lng: string;
};

const formatDateRange = (startDate?: string | null, endDate?: string | null) => {
  if (!startDate) return null;
  const start = format(new Date(startDate), 'dd MMM yyyy');
  if (endDate) {
    const end = format(new Date(endDate), 'dd MMM yyyy');
    return `${start} — ${end}`;
  }
  return start;
};

const ProjectCard = ({ project, index, lng }: ProjectCardProps) => {
  const image = getImagePayloadUrl(project.coverImage);
  const projectUrl = transformUrl(lng, `${urls.projects}/${project.slug}`);
  const dateLabel = formatDateRange(project.startDate, project.endDate);

  return (
    <Link
      href={projectUrl}
      className='group relative flex flex-col gap-5 pb-6 sm:flex-row sm:gap-8'
    >
      {/* Image */}
      {image?.url && (
        <div className='relative h-48 w-full shrink-0 overflow-hidden rounded-lg sm:h-52 sm:w-64 lg:w-72'>
          <ImageMedia
            resource={project.coverImage}
            alt={project.heading ?? image.alt ?? ''}
            fill
            className='object-cover'
            sizes='(max-width: 640px) 100vw, 288px'
            priority={index === 0}
          />
        </div>
      )}

      {/* Content */}
      <div className='flex flex-1 flex-col justify-center gap-2'>
        <h3 className='text-foreground text-xl font-bold tracking-tight lg:text-2xl'>
          {project.heading}
        </h3>

        {dateLabel && (
          <div className='text-muted-foreground mt-auto flex items-center gap-2 pt-2 text-sm font-medium'>
            <LuCalendarDays className='size-4' />
            <span>{dateLabel}</span>
          </div>
        )}
      </div>

      {/* Bottom line — grows left to right on hover */}
      <span className='bg-primary absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100' />
    </Link>
  );
};

export default ProjectCard;
