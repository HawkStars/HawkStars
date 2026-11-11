'use client';

import { LuCalendarDays, LuMapPin } from 'react-icons/lu';
import { HawkProject } from '@/payload-types';
import { transformUrl, SITE_GET_URLS } from '@/utils/paths';
import { formatDateRange } from '@/utils/date';
import { useTranslation } from '@/i18n/client';
import { Language } from '@/i18n/settings';
import ListingCard, { ListingMeta } from '@/components/shared/ListingCard';

type ProjectCardProps = {
  project: HawkProject;
  index: number;
  lng: Language;
  /** Wide card spanning the grid row — the first item of a list. */
  featured?: boolean;
};

/**
 * Project teaser on the shared `ListingCard`. A client component (like `NewsCard`) so the
 * live-preview list, which is a client tree, can render it too.
 */
const ProjectCard = ({ project, index, lng, featured = false }: ProjectCardProps) => {
  const { t } = useTranslation(lng, 'projects');
  const activityLabel = formatDateRange(project.startDate, project.endDate, lng);
  const durationLabel = formatDateRange(project.projectStartDate, project.projectEndDate, lng);

  // Only label the dates when there are two ranges to tell apart.
  const meta: ListingMeta[] = [];
  if (activityLabel) {
    meta.push({
      icon: LuCalendarDays,
      text: activityLabel,
      dateTime: project.startDate ?? undefined,
      label: durationLabel ? t('dates.activity') : undefined,
    });
  }
  if (durationLabel) {
    meta.push({
      icon: LuCalendarDays,
      text: durationLabel,
      dateTime: project.projectStartDate ?? undefined,
      label: t('dates.project'),
    });
  }
  if (project.location) meta.push({ icon: LuMapPin, text: project.location });

  return (
    <ListingCard
      href={transformUrl(lng, `${SITE_GET_URLS.projects}/${project.slug}`)}
      title={project.heading ?? ''}
      image={project.coverImage}
      badge={project.project_type ? t(`types.${project.project_type}`) : null}
      meta={meta}
      description={featured ? project.details?.text : null}
      ctaLabel={t('viewProject')}
      featured={featured}
      preload={index === 0}
      headingLevel='h3'
    />
  );
};

export default ProjectCard;
