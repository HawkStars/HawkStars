import { HawkStarsSection } from '@/components/layout';
import { client } from '@/lib/sanity/sanityClient';
import { LanguageProps } from '@/components/types';
import SanityCloudinaryImage from '@/components/sanity/SanityCloudinaryImage';
import { notFound } from 'next/navigation';
import { GetSingleArtworkResult } from '@/projects/sanity/sanity.types';
import { getServerTranslation } from '@/i18n';
import { extractInternationalI18nString } from '@/lib/sanity/helpers';
import { Language } from '@/i18n/settings';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import { firstPageEventsQuery } from '@/projects/sanity/models/types/groq/event';

const getHawkEvents = async () => {
  return await client.fetch<GetSingleArtworkResult>(firstPageEventsQuery);
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
       {events.map((event) => {

       }}
      </HawkStarsSection>
    </>
  );
};

export default EventsPage;
