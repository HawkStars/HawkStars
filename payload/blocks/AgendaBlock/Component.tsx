'use client';

import { useCallback, useEffect, useState } from 'react';
import type { AgendaBlock as AgendaBlockProps, HawkEvent, HawkProject } from '@/payload-types';
import { getImagePayloadUrl } from '@/lib/image';
import { AgendaBlockView, type AgendaEventItem } from './AgendaBlockView';
import { fetchAgendaEvents } from '@/lib/payload/client-side/queries/event';
import { fetchAgendaProjects } from '@/lib/payload/client-side/queries/projects';

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

export function AgendaBlockComponent({
  title,
  subtitle,
  eventType,
  maxEvents,
  layout,
  linkLabel,
  sectionId,
}: AgendaBlockProps) {
  const [events, setEvents] = useState<AgendaEventItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const [projects, events] = await Promise.all([
      fetchAgendaProjects({ maxEvents }),
      fetchAgendaEvents({ eventType, maxEvents }),
    ]);

    const projectsMapped = projects.map(toProjectToAgendaItem);
    const agendaMapped = events.map(toAgendaItem);
    const allEvents = [...projectsMapped, ...agendaMapped].sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateA - dateB;
    });

    setLoading(false);
    setEvents(allEvents);
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <AgendaBlockView
      title={title}
      subtitle={subtitle}
      layout={layout as 'list' | 'compact' | 'cards' | null}
      linkLabel={linkLabel}
      sectionId={sectionId}
      events={events}
      loading={loading}
    />
  );
}
