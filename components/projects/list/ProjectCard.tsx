import { HawkProject } from '@/payload-types';
import { LuCalendarDays } from 'react-icons/lu';
import { getImagePayloadUrl } from '@/lib/image';
import { transformUrl, SITE_GET_URLS } from '@/utils/paths';
import Link from 'next/link';
import { ImageMedia } from '@/payload/components/Media';
import { formatDateRange } from '@/utils/date';
import { getServerTranslation } from '@/i18n';

type ProjectCardProps = {
  project: HawkProject;
  index: number;
  lng: string;
};

const ProjectCard = async ({ project, index, lng }: ProjectCardProps) => {
  const { t } = await getServerTranslation(lng, 'projects');
  const image = getImagePayloadUrl(project.coverImage);
  const projectUrl = transformUrl(lng, `${SITE_GET_URLS.projects}/${project.slug}`);
  const activityLabel = formatDateRange(project.startDate, project.endDate, lng);
  const durationLabel = formatDateRange(project.projectStartDate, project.projectEndDate, lng);
  // Only label the dates when there are two ranges to tell apart.
  const dateRows = durationLabel
    ? [
        { label: t('dates.activity'), value: activityLabel },
        { label: t('dates.project'), value: durationLabel },
      ].filter((row) => row.value)
    : [{ label: null, value: activityLabel }].filter((row) => row.value);

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
            preload={index === 0}
          />
        </div>
      )}

      {/* Content */}
      <div className='flex flex-1 flex-col justify-center gap-2'>
        <h3 className='text-h3_semibold text-foreground'>{project.heading}</h3>

        {dateRows.length > 0 && (
          <div className='text-muted-foreground mt-auto flex flex-col gap-1 pt-2 text-sm font-medium'>
            {dateRows.map(({ label, value }) => (
              <p key={label ?? 'dates'} className='flex items-center gap-2'>
                <LuCalendarDays aria-hidden='true' className='size-4 shrink-0' />
                <span>
                  {label && <span className='text-foreground'>{label}: </span>}
                  {value}
                </span>
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Bottom line — grows left to right on hover */}
      <span className='bg-primary absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100' />
    </Link>
  );
};

export default ProjectCard;
