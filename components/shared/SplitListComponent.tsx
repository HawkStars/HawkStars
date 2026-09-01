import { LuArchive, LuCalendarDays } from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { transformUrl, SITE_GET_URLS } from '@/utils/paths';
import Link from 'next/link';
import { ReactNode } from 'react';
import { PaginatedDocs } from 'payload';
import { Language } from '@/i18n/settings';

type SplitListTranslations = {
  upcoming: string;
  noUpcoming: string;
  viewAgenda: string;
  viewAgendaDescription: string;
  viewArchive: string;
  viewArchiveDescription: string;
};

type SplitListProps<T> = {
  // Past items no longer live here -- they moved to their own paginated
  // archive page (see ArchiveListComponent), reached via `archiveUrl` below.
  items: { upcoming: T[]; current?: PaginatedDocs<T> };
  lng: Language;
  translations: SplitListTranslations;
  renderCard: (item: T, index: number) => ReactNode;
  archiveUrl: string;
};

const SplitListComponent = <T,>({
  items,
  lng,
  translations,
  renderCard,
  archiveUrl,
}: SplitListProps<T>) => {
  const { upcoming, current } = items || {};
  const { docs } = current || {};

  const {
    upcoming: upcomingLabel,
    noUpcoming,
    viewAgenda,
    viewAgendaDescription,
    viewArchive,
    viewArchiveDescription,
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
      {current && (
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
      )}

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

      {/* Archive CTA -- past items live on their own paginated page now */}
      <div className='flex flex-col items-start gap-4 rounded-xl border bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between lg:p-8'>
        <p className='text-body_regular text-muted-foreground'>{viewArchiveDescription}</p>
        <Button asChild size='lg' variant='outline' className='shrink-0'>
          <Link href={transformUrl(lng, archiveUrl)}>
            <LuArchive className='size-4' />
            {viewArchive}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default SplitListComponent;
