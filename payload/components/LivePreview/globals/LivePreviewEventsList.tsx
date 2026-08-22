'use client';

import React from 'react';
import { useLivePreview } from '@payloadcms/live-preview-react';
import type { EventsList } from '@/payload-types';
import { Language } from '@/i18n/settings';
import SplitListComponent from '@/components/shared/SplitListComponent';
import HeroImpactStatsBlock from '@/components/projects/list/HeroImpactStatsBlock';
import { SplitHawkEventsResult } from '@/lib/payload/queries/hawkEvent';
import EventCard from '@/components/events/list/EventCard';

type LivePreviewData = {
  eventsListInformation: EventsList | null;
  events: SplitHawkEventsResult;
  translations: {
    upcoming: string;
    past: string;
    noUpcoming: string;
    noPast: string;
    viewAgenda: string;
    viewAgendaDescription: string;
  };
};

type LivePreviewEventsListProps = {
  initialData: LivePreviewData;
  serverURL: string;
  lng: Language;
};

export const LivePreviewEventsList: React.FC<LivePreviewEventsListProps> = ({
  initialData,
  serverURL,
  lng,
}) => {
  const { data } = useLivePreview<LivePreviewData>({
    initialData,
    serverURL,
    depth: 2,
  });

  if (!data) return null;
  const { eventsListInformation, events, translations } = data;

  return (
    <>
      <HeroImpactStatsBlock {...eventsListInformation} />
      <SplitListComponent
        items={events}
        lng={lng}
        translations={translations}
        renderCard={(event, idx) => (
          <EventCard key={event.id} event={event} index={idx} lng={lng} />
        )}
      />
    </>
  );
};
