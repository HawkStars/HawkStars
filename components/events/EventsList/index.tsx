import Image from 'next/image';
import Link from 'next/link';
import { HawkEvent, Media } from '@/payload-types';
import { PaginatedDocs } from 'payload';

type EventsListProps = {
  events: PaginatedDocs<HawkEvent>;
  page: number;
};

const EventsList = ({ events, page }: EventsListProps) => {
  const { docs, totalPages } = events;

  return (
    <>
      {docs.length == 0 && <div>No events found</div>}
      {docs.length > 0 && (
        <>
          <ul>
            {docs.map((event: HawkEvent) => {
              const image = (event.image && (event.image as Media)) || null;
              return (
                <Link key={event.id} href={`/events/${event.slug}`}>
                  <div>
                    <span>{event.title}</span>
                    {image?.url && <Image src={image.url} width={200} height={200} alt='' />}
                  </div>
                </Link>
              );
            })}
          </ul>
          {/* missing pagination logic */}
          {totalPages > page && <Link href={`/events?page=${page + 1}`}>Next Page</Link>}
        </>
      )}
    </>
  );
};

export default EventsList;
