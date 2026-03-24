import React, { useCallback, useEffect, useState } from 'react';
import type {
  HawkProject,
  UpcomingHawkEventBlock as UpcomingHawkEventBlockProps,
} from '@/payload-types';
import type { Where } from 'payload';
import { getImagePayloadUrl } from '@/lib/image';
import { UpcomingHawkEventBlockView } from './UpcomingHawkEventBlockView';
import { stringify } from 'qs-esm';

const typeLabels: Record<string, string> = {
  erasmus: 'Erasmus +',
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
  const [upcomingEvent, setUpcomingEvent] = useState<HawkProject | null>(null);

  const getUpcomingEvent = useCallback(async () => {
    const where: Where = {};
    if (eventType && eventType.length > 0) where.type_event = { in: eventType };

    const stringifiedQuery = stringify({ where, limit: 1 }, { addQueryPrefix: true });

    try {
      const response = await fetch(`/api/hawk_projects${stringifiedQuery}`, {
        method: 'GET',
      });

      if (!response.ok) {
        console.error('Failed to fetch upcoming event:', response.statusText);
        setUpcomingEvent(null);
        return;
      }

      const data = await response.json();
      setUpcomingEvent(data?.docs?.[0] || null);
    } catch (error) {
      console.error('Error fetching upcoming event:', error);
      setUpcomingEvent(null);
    }
  }, []);

  useEffect(() => {
    getUpcomingEvent();
  }, [getUpcomingEvent]);

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
