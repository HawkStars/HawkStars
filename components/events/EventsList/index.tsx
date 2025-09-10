'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useMainAppContext } from '@/utils/contexts/AppProvider';
import { HawkEvent, Media } from '@/payload-types';

const getFirstHawkEvents = async () => {
  return Promise.resolve([]);
};

const getNextPageEvents = async (lastId: number, updatedAt: string) => {
  return Promise.resolve([]);
};

const EventsList = () => {
  const { lng } = useMainAppContext();
  const [events, setEvents] = useState<HawkEvent[]>([]);
  const [lastHawkEvent, setLastHawkEvent] = useState<Pick<HawkEvent, 'id' | 'updatedAt'> | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    const result = await getFirstHawkEvents();
    setEvents(result as unknown as HawkEvent[]);
    if (result.length > 0) setLastHawkEvent(result[result.length - 1]);
    setLoading(false);
  };

  const fetchNextPage = async () => {
    setLoading(true);
    if (!lastHawkEvent) return;
    const result = await getNextPageEvents(lastHawkEvent.id, lastHawkEvent.updatedAt);
    setEvents([...events, ...result] as HawkEvent[]);
    if (result.length > 0) setLastHawkEvent(result[result.length - 1]);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <>
      {events.length == 0 && <div>No events found</div>}
      {events.length > 0 && (
        <>
          <ul>
            {events.map((event: HawkEvent) => {
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
          {loading ? <p>Loading...</p> : <button onClick={fetchNextPage}>Load More</button>}
        </>
      )}
    </>
  );
};

export default EventsList;
