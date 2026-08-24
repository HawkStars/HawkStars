import { LuCalendarDays } from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { transformUrl, SITE_GET_URLS } from '@/utils/paths';
import Link from 'next/link';
import { ReactNode } from 'react';
import { PaginatedDocs } from 'payload';

type SplitListTranslations = {
  upcoming: string;
  past: string;
  noUpcoming: string;
  noPast: string;
  viewAgenda: string;
  viewAgendaDescription: string;
};

type SplitListProps<T> = {
  items: { upcoming: T[]; past: T[]; current?: PaginatedDocs<T> };
  lng: string;
  translations: SplitListTranslations;
  renderCard: (item: T, index: number) => ReactNode;
};

const SplitListComponent = <T,>({ items, lng, translations, renderCard }: SplitListProps<T>) => {
  const { upcoming, past, current } = items || {};
  const { docs } = current || {};

  const {
    upcoming: upcomingLabel,
    past: pastLabel,
    noUpcoming,
    noPast,
    viewAgenda,
    viewAgendaDescription,
  } = translations;

  return (
    <div className='flex flex-col gap-12 px-6 py-8 lg:gap-16 lg:px-12 lg:py-12'>
      {/* Agenda CTA */}
      <div className='flex flex-col items-start gap-4 rounded-xl border bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between lg:p-8'>
        <p className='text-body_regular text-muted-foreground'>{viewAgendaDescription}</p>
        <Button asChild size='lg' className='shrink-0'>
          <Link href={transformUrl(lng, SITE_GET_URLS.agenda)}>
            <LuCalendarDays className='size-4' />
            {viewAgenda}
          </Link>
        </Button>
      </div>

      {/* Current Events */}
      <section>
        <h2 className='text-h2_semibold mb-6'>{upcomingLabel}</h2>
        {docs?.length === 0 ? (
          <p className='text-muted-foreground text-body_regular'>{noUpcoming}</p>
        ) : (
          <div className='flex flex-col gap-6'>
            {docs?.map((item, idx) => renderCard(item, idx))}
          </div>
        )}
      </section>

      {/* Upcoming */}
      <section>
        <h2 className='text-h2_semibold mb-6'>{upcomingLabel}</h2>
        {upcoming.length === 0 ? (
          <p className='text-muted-foreground text-body_regular'>{noUpcoming}</p>
        ) : (
          <div className='flex flex-col gap-6'>
            {upcoming.map((item, idx) => renderCard(item, idx))}
          </div>
        )}
      </section>

      {/* Past */}
      <section>
        <h2 className='text-h2_semibold mb-6'>{pastLabel}</h2>
        {past.length === 0 ? (
          <p className='text-muted-foreground text-body_regular'>{noPast}</p>
        ) : (
          <div className='flex flex-col gap-6'>
            {past.map((item, idx) => renderCard(item, idx))}
          </div>
        )}
      </section>
    </div>
  );
};

export default SplitListComponent;
