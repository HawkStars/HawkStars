'use client';

import { useEffect, useState } from 'react';
import type { AgendaBlock as AgendaBlockProps, HawkEvent } from '@/payload-types';
import { getImagePayloadUrl } from '@/lib/image';
import { AgendaBlockView, type AgendaEventItem } from './AgendaBlockView';
import { fetchAgendaEvents } from '@/lib/payload/client/event';

function toAgendaItem(event: HawkEvent): AgendaEventItem {
  const image = getImagePayloadUrl(event.image);
  return {
    id: event.id,
    heading: event.heading,
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

  useEffect(() => {
    fetchAgendaEvents({ eventType, maxEvents })
      .then((docs) => setEvents(docs.map(toAgendaItem)))
      .finally(() => setLoading(false));
  }, [eventType, maxEvents]);

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
