'use client';

import React, { useEffect, useState } from 'react';
import type {
  HawkEvent,
  UpcomingHawkEventBlock as UpcomingHawkEventBlockProps,
} from '@/payload-types';
import { getImagePayloadUrl } from '@/lib/image';
import { UpcomingHawkEventBlockView } from './UpcomingHawkEventBlockView';
import { fetchEvent } from '@/lib/payload/client-side/queries/event';
import { Language } from '@/i18n/settings';
import { useTranslation } from '@/i18n/client';

export const UpcomingHawkEventBlock: React.FC<UpcomingHawkEventBlockProps & { lng: Language }> = ({
  title,
  subtitle,
  eventType,
  linkLabel,
  sectionId,
  lng,
}) => {
  const { t } = useTranslation(lng, 'common');
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
      linkLabel={linkLabel || t('blocks.learnMore')}
      sectionId={sectionId}
      event={{
        heading: upcomingEvent.heading,
        subheading: upcomingEvent.subheading,
        description: upcomingEvent.description,
        // Was a hardcoded English map (`Local Event` / `International Event` / `Other`)
        // rendered as the badge on a pt-default site.
        badge: upcomingEvent.type_event
          ? t(`blocks.eventTypes.${upcomingEvent.type_event}`, {
              defaultValue: upcomingEvent.type_event,
            })
          : null,
        image: image ?? null,
        href: `/events/${upcomingEvent.slug}`,
      }}
    />
  );
};
