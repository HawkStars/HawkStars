import Image from 'next/image';
import Link from 'next/link';
import { HawkEvent, Media } from '@/payload-types';
import { PaginatedDocs } from 'payload';

type EventsListProps = {
  events: PaginatedDocs<HawkEvent>;
};

const EventsList = ({ events }: EventsListProps) => {
  const { docs } = events;

  return (
    <>
      {docs.length == 0 && <div>No events found</div>}
      {docs.length > 0 && (
        <div className='grid grid-cols-1 md:grid-cols-2'>
          {docs.map((event: HawkEvent) => {
            const image = (event.image && (event.image as Media)) || null;
            return (
              <Link key={event.id} href={`/events/${event.slug}`} className='cursor-pointer'>
                <span className='px-4 text-xl font-semibold'>{event.title}</span>
                {image?.url && <Image src={image.url} width={200} height={200} alt='' />}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
};

export default EventsList;
