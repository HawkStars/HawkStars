'use client';

import Image from 'next/image';
import { sanityFetch } from '@/lib/sanity/sanityClient';
import { FirstPageEventsQueryResult, HawkEvent } from '@/projects/sanity/sanity.types';
import { firstPageEventsQuery, nextPageEventsQuery } from '@/projects/sanity/types/queries/event';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const getFirstHawkEvents = async () => {
  return await sanityFetch<FirstPageEventsQueryResult>({
    query: firstPageEventsQuery,
    revalidate: 86400,
  });
};

const getNextPageEvents = async (lastId: string) => {
  return await sanityFetch<FirstPageEventsQueryResult>({
    query: nextPageEventsQuery,
    revalidate: 86400,
    params: { lastId },
  });
};

const EventsList = () => {
  const [events, setEvents] = useState<HawkEvent[]>([]);
  const [lastId, setLastId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    const result = await getFirstHawkEvents();
    setEvents(result);
    if (result.length > 0) setLastId(result[result.length - 1]._id);
    setLoading(false);
  };

  const fetchNextPage = async () => {
    setLoading(true);
    if (!lastId) return;
    const result = await getNextPageEvents(lastId);
    setEvents([...events, ...result]);
    if (result.length > 0) setLastId(result[result.length - 1]._id);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <>
      {events.length == 0 && <div>No events found</div>}

      <ul>
        {events.map((event: HawkEvent) => {
          const firstImage = (event.image && event.image[0]) || null;
          return (
            <Link key={event._id} href={`/events/${event.slug?.current}`}>
              <div>
                <span>{event.name}</span>
                {firstImage?.url && (
                  <Image src={firstImage.url} alt={event.name || ''} width={200} height={200} />
                )}
              </div>
            </Link>
          );
        })}
      </ul>
      {loading ? <p>Loading...</p> : <button onClick={fetchNextPage}>Load More</button>}
    </>
  );
};

export default EventsList;
