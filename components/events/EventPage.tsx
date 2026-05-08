import Image from 'next/image';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

import { getImagePayloadUrl } from '@/lib/image';
import { RichText } from '@payloadcms/richtext-lexical/react';

/* ================================================================== */
/*  Section wrapper for consistent spacing + alternating backgrounds  */
/* ================================================================== */
function Section({
  children,
  alt = false,
  className = '',
}: {
  children: React.ReactNode;
  alt?: boolean;
  className?: string;
}) {
  return (
    <section className={`py-16 ${alt ? 'bg-[#eef5f0]' : 'bg-white'} ${className}`}>
      <div className='container mx-auto max-w-6xl px-4'>{children}</div>
    </section>
  );
}

/* ================================================================== */
/*  MAIN COMPONENT                                                    */
/* ================================================================== */
interface EventPageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  event: Record<string, any>;
}

export default function EventPage({ event }: EventPageProps) {
  /* Date formatting */
  const startDate = event.date ? new Date(event.date) : null;
  const endDate = event.endDate ? new Date(event.endDate) : null;

  const dateLabel = (() => {
    if (!startDate) return '';
    if (endDate && event.isDateRange) {
      return `${format(startDate, 'd', { locale: pt })} a ${format(endDate, "d 'de' MMMM 'de' yyyy", { locale: pt })}`;
    }
    return format(startDate, "d 'de' MMMM 'de' yyyy", { locale: pt });
  })();

  /* Hero image */
  const heroImage = event.image ? getImagePayloadUrl(event.image) : null;

  return (
    <main>
      {/* ---------------------------------------------------------- */}
      {/*  1. HERO SECTION                                           */}
      {/* ---------------------------------------------------------- */}
      <Section alt className='pt-32'>
        <div className='grid gap-10 md:grid-cols-2'>
          {/* Left column */}
          <div>
            {/* Title */}
            <h1 className='text-4xl font-bold md:text-5xl'>{event.heading}</h1>

            {/* Subtitle */}
            {event.subheading && (
              <p className='mt-2 text-lg text-gray-600'>{event.subheading}</p>
            )}

            {/* Date */}
            {dateLabel && (
              <div className='mt-4 flex items-center gap-2'>
                <svg
                  className='h-5 w-5 text-gray-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                  />
                </svg>
                <span className='text-lg font-semibold'>{dateLabel}</span>
              </div>
            )}

            {/* Event type badge */}
            {event.type_event && (
              <div className='mt-4'>
                <span className='bg-green inline-block rounded-full px-4 py-1.5 text-sm font-semibold capitalize text-white'>
                  {event.type_event.replace('_', ' ')}
                </span>
              </div>
            )}

            {/* Description */}
            {event.description && (
              <p className='mt-6 text-justify text-base leading-relaxed text-gray-800'>
                {event.description}
              </p>
            )}
          </div>

          {/* Right column: image */}
          <div className='flex flex-col gap-4'>
            {heroImage?.url && (
              <div className='relative aspect-video w-full overflow-hidden rounded-lg'>
                <Image
                  src={heroImage.url}
                  alt={heroImage.alt || event.heading || 'Event image'}
                  className='h-full w-full object-cover'
                  fill
                />
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/*  2. RICH CONTENT SECTION                                   */}
      {/* ---------------------------------------------------------- */}
      {event.page_content && (
        <Section>
          <div className='prose prose-lg mx-auto max-w-4xl'>
            <RichText data={event.page_content} />
          </div>
        </Section>
      )}
    </main>
  );
}
