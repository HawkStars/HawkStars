'use client';

import React, { useEffect, useState } from 'react';
import type {
  HawkEvent,
  UpcomingHawkEventBlock as UpcomingHawkEventBlockProps,
} from '@/payload-types';
import { getImagePayloadUrl } from '@/lib/image';
import { UpcomingHawkEventBlockView } from './UpcomingHawkEventBlockView';
import { fetchEvent } from '@/lib/payload/client/event';

const typeLabels: Record<string, string> = {
  local_event: 'Local Event',
  international_event: 'International Event',
  other: 'Other',
};

export const UpcomingHawkEventBlock: React.FC<UpcomingHawkEventBlockProps> = ({
  title,
  subtitle,
  eventType,
  linkLabel = 'Learn more',
  sectionId,
}) => {
  const [upcomingEvent, setUpcomingEvent] = useState<HawkEvent | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      const response = await fetchEvent({ controller, eventType });
      setUpcomingEvent(response);
    };

    fetchData();

    return () => controller.abort();
  }, [eventType]);

  if (!upcomingEvent) return null;

  const image = getImagePayloadUrl(upcomingEvent.image);

  return (
    <UpcomingHawkEventBlockView
      title={title}
      subtitle={subtitle}
      linkLabel={linkLabel}
      sectionId={sectionId}
      event={{
        heading: upcomingEvent.heading,
        subheading: upcomingEvent.subheading,
        description: upcomingEvent.description,
        badge: upcomingEvent.type_event
          ? typeLabels[upcomingEvent.type_event] || upcomingEvent.type_event
          : null,
        image: image ?? null,
        href: `/events/${upcomingEvent.slug}`,
      }}
    />
  );
};
