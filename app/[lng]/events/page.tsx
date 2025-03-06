import { HawkStarsSection } from '@/components/layout';
import { client } from '@/lib/sanity/sanityClient';
import { LanguageProps } from '@/components/types';
import { FirstPageEventsQueryResult, Event } from '@/projects/sanity/sanity.types';
import { Language } from '@/i18n/settings';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import { firstPageEventsQuery } from '@/projects/sanity/types/queries/event';

const getHawkEvents = async () => {
  return await client.fetch<FirstPageEventsQueryResult>(firstPageEventsQuery);
};

export async function generateMetadata(props: EventsPageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;

  const metadataPage = getMetadataPageInfo(lng as Language, 'home');
  return metadataPage;
}

type EventsPageProps = { params: Promise<LanguageProps> };

const EventsPage = async (props: EventsPageProps) => {
  const params = await props.params;
  const { lng } = params;

  const events = await getHawkEvents();

  return (
    <>
      <HawkStarsSection className='flex gap-8 bg-bege-light pb-8 pt-10 max-lg:flex-col max-lg:px-0 max-lg:pt-0'>
        {events.length == 0 && <div>No events found</div>}
        {events.map((event: Event) => {
          return <></>;
        })}
      </HawkStarsSection>
    </>
  );
};

export default EventsPage;
