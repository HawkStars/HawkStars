import { Media } from '@/payload-types';
import { LuCalendarDays } from 'react-icons/lu';
import { getImagePayloadUrl } from '@/lib/image';
import { transformUrl, urls } from '@/utils/paths';
import Link from 'next/link';
import { ImageMedia } from '@/payload/components/Media';
import { format } from 'date-fns';

type EventCardProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  event: Record<string, any>;
  index: number;
  lng: string;
};

const formatDateRange = (date: string, endDate?: string | null, isDateRange?: boolean | null) => {
  const start = format(new Date(date), 'dd MMM yyyy');
  if (isDateRange && endDate) {
    const end = format(new Date(endDate), 'dd MMM yyyy');
    return `${start} — ${end}`;
  }
  return start;
};

const EventCard = ({ event, lng }: EventCardProps) => {
  const image = getImagePayloadUrl(event.image) as Media | null;
  const eventUrl = transformUrl(lng, `${urls.events}/${event.slug}`);

  return (
    <Link href={eventUrl} className='group relative flex flex-col gap-5 pb-6 sm:flex-row sm:gap-8'>
      {/* Image */}
      {image?.url && (
        <div className='relative h-48 w-full shrink-0 overflow-hidden rounded-lg sm:h-52 sm:w-64 lg:w-72'>
          <ImageMedia
            resource={event.image}
            alt={event.heading ?? image.alt ?? ''}
            fill
            className='object-cover'
            sizes='(max-width: 640px) 100vw, 288px'
          />
        </div>
      )}

      {/* Content */}
      <div className='flex flex-1 flex-col justify-center gap-2'>
        <h3 className='text-foreground text-xl font-bold tracking-tight lg:text-2xl'>
          {event.heading}
        </h3>

        {event.subheading && (
          <p className='text-muted-foreground text-sm font-medium tracking-wider uppercase'>
            {event.subheading}
          </p>
        )}

        {event.description && (
          <p className='text-muted-foreground line-clamp-2 text-sm leading-relaxed lg:text-base'>
            {event.description}
          </p>
        )}

        {event.date && (
          <div className='text-muted-foreground mt-auto flex items-center gap-2 pt-2 text-sm font-medium'>
            <LuCalendarDays className='size-4' />
            <span>{formatDateRange(event.date, event.endDate, event.isDateRange)}</span>
          </div>
        )}
      </div>

      {/* Bottom line — grows left to right on hover */}
      <span className='bg-primary absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100' />
    </Link>
  );
};

export default EventCard;
