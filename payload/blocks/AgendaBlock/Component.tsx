import type { AgendaBlock as AgendaBlockProps, HawkEvent, HawkProject } from '@/payload-types';
import { getImagePayloadUrl } from '@/lib/image';
import { AgendaBlockView, type AgendaEventItem } from './AgendaBlockView';
import { getAgendaForBlock } from '@/lib/payload/queries/blocks';
import { Language } from '@/i18n/settings';

function toAgendaItem(event: HawkEvent): AgendaEventItem {
  const image = getImagePayloadUrl(event.image);
  return {
    id: event.id,
    heading: event.heading ?? '',
    subheading: event.subheading ?? null,
    description: event.description ?? null,
    badge: event.type_event ?? null,
    image: image ? image : null,
    href: `/events/${event.slug}`,
    date: event.date ?? null,
    endDate: event.endDate ?? null,
    isDateRange: Boolean(event.isDateRange),
  };
}

function toProjectToAgendaItem(project: HawkProject): AgendaEventItem {
  const image = getImagePayloadUrl(project.coverImage);
  return {
    id: project.id,
    heading: project.heading ?? '',
    subheading: null,
    description: project.details?.text ?? null,
    badge: 'Project',
    image: image ? image : null,
    href: `/projects/${project.slug}`,
    date: project.startDate ?? null,
    endDate: project.endDate ?? null,
    isDateRange: true,
  };
}

// Server component. The client version issued two parallel REST calls after
// hydration — the projects one returning up to 20 documents at depth 2, i.e. the whole
// page-tab, partners and itinerary tree — with no locale and nothing cached.
export async function AgendaBlockComponent({
  title,
  subtitle,
  eventType,
  maxEvents,
  layout,
  linkLabel,
  sectionId,
  lng,
}: AgendaBlockProps & { lng: Language }) {
  const { events, projects } = await getAgendaForBlock(lng, eventType, maxEvents);

  const allEvents = [...projects.map(toProjectToAgendaItem), ...events.map(toAgendaItem)].sort(
    (a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateA - dateB;
    }
  );

  return (
    <AgendaBlockView
      title={title}
      subtitle={subtitle}
      layout={layout as 'list' | 'compact' | 'cards' | null}
      linkLabel={linkLabel}
      sectionId={sectionId}
      events={allEvents}
      loading={false}
    />
  );
}
