import EventsList from '@/components/events/EventsList';
import { HawkStarsSection } from '@/components/layout';
import { LanguageProps } from '@/components/types';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { getEventsQuery } from '@/lib/payload/queries/event';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';

export async function generateMetadata(props: EventsPageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;

  const metadataPage = getMetadataPageInfo(lng as Language, 'home');
  return metadataPage;
}

type EventsPageProps = {
  params: Promise<LanguageProps>;
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

const EventsPage = async (props: EventsPageProps) => {
  const params = await props.params;
  const { lng } = params;
  const searchParams = await props.searchParams;
  const page = searchParams.page ? Number(searchParams.page) : 1;

  const events = await getEventsQuery(page);

  return (
    <HawkStarsSection className='bg-bege-light gap-8 pt-10 pb-8 max-lg:px-0 max-lg:pt-0 xl:px-10!'>
      <EventsList events={events} />
      {/* missing pagination logic */}
      {/* {totalPages > page && <Link href={`/events?page=${page + 1}`}>Next Page</Link>} */}
    </HawkStarsSection>
  );
};

export default EventsPage;
