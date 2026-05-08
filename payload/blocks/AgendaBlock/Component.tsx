'use client';

import { useCallback, useEffect, useState } from 'react';
import { stringify } from 'qs-esm';
import type { Where } from 'payload';
import type { AgendaBlock as AgendaBlockProps, HawkEvent } from '@/payload-types';
import { getImagePayloadUrl } from '@/lib/image';
import { AgendaBlockView, type AgendaEventItem } from './AgendaBlockView';

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

  const fetchEvents = useCallback(async () => {
    const today = new Date().toISOString();
    const limit = maxEvents && maxEvents > 0 ? Math.min(maxEvents, 20) : 5;

    // Base filter: show events that haven't started yet OR multi-day events not yet ended
    const dateFilter: Where = {
      or: [{ date: { greater_than_equal: today } }, { endDate: { greater_than_equal: today } }],
    };

    // Combine with event type filter if specified
    const where: Where =
      eventType && eventType.length > 0
        ? { and: [dateFilter, { type_event: { in: eventType } }] }
        : dateFilter;

    const query = stringify({ where, limit, sort: 'date' }, { addQueryPrefix: true });

    try {
      const res = await fetch(`/api/hawk_projects${query}`);
      if (!res.ok) {
        console.error('AgendaBlock: failed to fetch events', res.statusText);
        setEvents([]);
        return;
      }
      const data = await res.json();
      setEvents((data?.docs ?? []).map(toAgendaItem));
    } catch (err) {
      console.error('AgendaBlock: error fetching events', err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [eventType, maxEvents]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

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
