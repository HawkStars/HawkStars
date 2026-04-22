import { Media } from '@/payload-types';
import { ArrowUpRight, CalendarDays } from 'lucide-react';
import { getImagePayloadUrl } from '@/lib/image';
import { Button } from '@/components/ui/button';
import { transformUrl, urls } from '@/utils/paths';
import Link from 'next/link';
import { format } from 'date-fns';
import { SplitHawkEventsResult } from '@/lib/payload/queries/hawkEvent';

type EventsListProps = {
  events: SplitHawkEventsResult;
  lng: string;
  translations: {
    upcomingEvents: string;
    pastEvents: string;
    noUpcomingEvents: string;
    noPastEvents: string;
    viewAgenda: string;
    viewAgendaDescription: string;
    viewEvent: string;
  };
};

type EventCardProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  event: Record<string, any>;
  index: number;
  lng: string;
  viewEventLabel: string;
};

const EventCard = ({ event, index, lng, viewEventLabel }: EventCardProps) => {
  const image = getImagePayloadUrl(event.image);
  const eventUrl = transformUrl(lng, `${urls.events}/${event.slug}`);

  return (
    <Link
      href={eventUrl}
      className='group relative isolate min-h-72 bg-cover bg-center px-5 py-14 lg:px-12 lg:py-24'
      style={{
        backgroundImage: `url(${(image as Media)?.url})`,
      }}
    >
      <div className='relative z-10 flex flex-col gap-7 text-white/80 transition-colors duration-300 ease-out group-hover:text-white lg:flex-row'>
        <div className='flex gap-1 text-2xl font-bold'>
          <span>/</span>
          <span>{String(index + 1).padStart(2, '0')}</span>
        </div>
        <div className='flex flex-1 flex-col gap-2.5'>
          <h3 className='text-2xl font-bold lg:text-4xl'>{event.heading}</h3>
          <p className='text-sm font-medium uppercase'>{event.subheading}</p>
          {event.date && (
            <div className='flex items-center gap-1.5 text-sm font-medium'>
              <CalendarDays className='size-4' />
              <span>{format(new Date(event.date), 'dd MMM yyyy')}</span>
            </div>
          )}
        </div>
        <div className='flex-1'>
          <div className='flex flex-col'>
            <p>{event.description}</p>
            <div className='mt-2.5 h-0 overflow-hidden transition-all duration-300 ease-out group-hover:h-10'>
              <div>
                <Button
                  variant='outline'
                  size='lg'
                  className='dark w-fit opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100'
                >
                  {viewEventLabel}
                  <ArrowUpRight className='size-4' />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='absolute inset-0 z-0 bg-black/80 backdrop-blur-xs transition-all duration-300 ease-out group-hover:bg-black/50 group-hover:backdrop-blur-none' />
    </Link>
  );
};

const EventsListComponent = ({ events, lng, translations }: EventsListProps) => {
  const { upcoming, past } = events || {};
  const {
    upcomingEvents,
    pastEvents,
    noUpcomingEvents,
    noPastEvents,
    viewAgenda,
    viewAgendaDescription,
    viewEvent,
  } = translations;

  return (
    <div className='flex flex-col gap-16'>
      {/* Agenda CTA */}
      <div className='flex flex-col items-start gap-4 rounded-xl border bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <p className='text-body_regular text-muted-foreground'>{viewAgendaDescription}</p>
        </div>
        <Button asChild size='lg' className='shrink-0'>
          <Link href={transformUrl(lng, urls.agenda)}>
            <CalendarDays className='size-4' />
            {viewAgenda}
          </Link>
        </Button>
      </div>

      {/* Upcoming Events */}
      <section>
        <h2 className='text-h2_semibold mb-6'>{upcomingEvents}</h2>
        {upcoming.length === 0 ? (
          <p className='text-muted-foreground text-body_regular'>{noUpcomingEvents}</p>
        ) : (
          <div className='flex flex-col gap-5'>
            {upcoming.map((event, idx) => (
              <EventCard
                key={event.id}
                event={event}
                index={idx}
                lng={lng}
                viewEventLabel={viewEvent}
              />
            ))}
          </div>
        )}
      </section>

      {/* Past Events */}
      <section>
        <h2 className='text-h2_semibold mb-6'>{pastEvents}</h2>
        {past.length === 0 ? (
          <p className='text-muted-foreground text-body_regular'>{noPastEvents}</p>
        ) : (
          <div className='flex flex-col gap-5'>
            {past.map((event, idx) => (
              <EventCard
                key={event.id}
                event={event}
                index={idx}
                lng={lng}
                viewEventLabel={viewEvent}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default EventsListComponent;
