import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

import { getImagePayloadUrl } from '@/lib/image';
import { ImageMedia } from '@/payload/components/Media';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';

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
  lng: Language;
}

export default async function EventPage({ event, lng }: EventPageProps) {
  const { t } = await getServerTranslation(lng, 'events');

  /* Date formatting */
  const startDate = event.date ? new Date(event.date) : null;
  const endDate = event.endDate ? new Date(event.endDate) : null;

  const dateLabel = (() => {
    if (!startDate) return '';
    if (endDate && event.isDateRange) {
      return `${format(startDate, 'd', { locale: pt })} ${t('dateRange.to')} ${format(endDate, "d 'de' MMMM 'de' yyyy", { locale: pt })}`;
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
            {event.subheading && <p className='mt-2 text-lg text-gray-600'>{event.subheading}</p>}

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
                <span className='bg-green inline-block rounded-full px-4 py-1.5 text-sm font-semibold text-white capitalize'>
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
                <ImageMedia
                  resource={event.image}
                  alt={heroImage.alt || event.heading || t('a11y.imageAlt')}
                  className='h-full w-full object-cover'
                  fill
                />
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/*  2. DESCRIPTION SECTION                                   */}
      {/* ---------------------------------------------------------- */}
      {(event.details?.text || event.details?.sections?.length > 0) && (
        <Section>
          <div className='mx-auto max-w-4xl space-y-8'>
            {event.details.text && (
              <p className='text-justify text-base leading-relaxed text-gray-800'>
                {event.details.text}
              </p>
            )}
            {event.details.sections?.map(
              (section: { title?: string; text?: string }, i: number) => (
                <div key={i}>
                  {section.title && (
                    <h2 className='mb-3 text-2xl font-semibold'>{section.title}</h2>
                  )}
                  {section.text && (
                    <p className='text-justify text-base leading-relaxed text-gray-800'>
                      {section.text}
                    </p>
                  )}
                </div>
              )
            )}
          </div>
        </Section>
      )}

      {/* ---------------------------------------------------------- */}
      {/*  3. OBJECTIVES SECTION                                    */}
      {/* ---------------------------------------------------------- */}
      {(event.objectives?.introduction || event.objectives?.items?.length > 0) && (
        <Section alt>
          <div className='mx-auto max-w-4xl'>
            <h2 className='mb-6 text-3xl font-bold'>{t('sections.objectives')}</h2>
            {event.objectives.introduction && (
              <p className='mb-6 text-base leading-relaxed text-gray-800'>
                {event.objectives.introduction}
              </p>
            )}
            {event.objectives.items?.length > 0 && (
              <ul className='list-disc space-y-2 pl-6 text-gray-800'>
                {event.objectives.items.map((item: { text?: string }, i: number) => (
                  <li key={i}>{item.text}</li>
                ))}
              </ul>
            )}
          </div>
        </Section>
      )}

      {/* ---------------------------------------------------------- */}
      {/*  4. PROGRAM / SCHEDULE SECTION                            */}
      {/* ---------------------------------------------------------- */}
      {event.program?.length > 0 && (
        <Section>
          <div className='mx-auto max-w-4xl'>
            <h2 className='mb-8 text-3xl font-bold'>{t('sections.program')}</h2>
            <div className='space-y-6'>
              {event.program.map(
                (item: { day?: string; title?: string; description?: string }, i: number) => (
                  <div key={i} className='flex gap-6 border-l-4 border-green-600 pl-6'>
                    {item.day && (
                      <span className='mt-0.5 min-w-20 text-sm font-semibold text-gray-500'>
                        {item.day}
                      </span>
                    )}
                    <div>
                      {item.title && <h3 className='text-lg font-semibold'>{item.title}</h3>}
                      {item.description && (
                        <p className='mt-1 text-sm text-gray-700'>{item.description}</p>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </Section>
      )}

      {/* ---------------------------------------------------------- */}
      {/*  5. PHOTO GALLERY SECTION                                 */}
      {/* ---------------------------------------------------------- */}
      {(event.gallery?.internalImages?.length > 0 || event.gallery?.externalImages?.length > 0) && (
        <Section alt>
          <h2 className='mb-8 text-3xl font-bold'>{t('sections.gallery')}</h2>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4'>
            {event.gallery.internalImages?.map(
              (item: { image?: { url?: string; alt?: string } }, i: number) =>
                item.image?.url ? (
                  <div key={i} className='relative aspect-square overflow-hidden rounded-lg'>
                    <ImageMedia
                      src={item.image.url}
                      alt={item.image.alt || ''}
                      fill
                      className='object-cover'
                    />
                  </div>
                ) : null
            )}
            {event.gallery.externalImages?.map((item: { url?: string; alt?: string }, i: number) =>
              item.url ? (
                <div key={i} className='relative aspect-square overflow-hidden rounded-lg'>
                  <ImageMedia src={item.url} alt={item.alt || ''} fill className='object-cover' />
                </div>
              ) : null
            )}
          </div>
        </Section>
      )}
    </main>
  );
}
