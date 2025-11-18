'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useMainAppContext } from '@/utils/contexts/AppProvider';
import { HawkEvent, Media } from '@/payload-types';
import { getEventsQuery } from '@/lib/payload/queries/event';
import { LoadingState } from '@/utils/page';

type EventsResponse = {
  events: HawkEvent[];
  totalPages: number;
  hasNextPage: boolean;
  nextPage?: number | null;
};

const EventsList = () => {
  const { lng } = useMainAppContext();
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [page, setPage] = useState(1);
  const [eventsInfo, setEventsInfo] = useState<EventsResponse>({
    events: [],
    totalPages: 0,
    hasNextPage: false,
    nextPage: null,
  });

  const fetchEvents = async (page: number) => {
    setLoading('submitting');
    const result = await getEventsQuery(page, lng);
    const { docs, totalPages, hasNextPage, nextPage } = result;
    setEventsInfo({ events: docs, totalPages, hasNextPage, nextPage });
    setLoading('success');
  };

  // useEffect(() => {
  //   fetchEvents(page);
  // }, [page]);

  return (
    <>
      {eventsInfo.events.length == 0 && <div>No events found</div>}
      {eventsInfo.events.length > 0 && (
        <>
          <ul>
            {eventsInfo.events.map((event: HawkEvent) => {
              const firstImage = (event.image && (event.image as Media)) || null;
              return (
                <Link key={event.id} href={`/events/${event.slug}`}>
                  <div>
                    <span>{event.title}</span>
                    {firstImage?.url && (
                      <Image src={firstImage.url} width={200} height={200} alt='' />
                    )}
                  </div>
                </Link>
              );
            })}
          </ul>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <button onClick={() => setPage((prev) => prev + 1)}>Load More</button>
          )}
        </>
      )}
    </>
  );
};

export default EventsList;
