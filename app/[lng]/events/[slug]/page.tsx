import { HawkStarsSection } from '@/components/layout';
import { client } from '@/lib/sanity/sanityClient';
import { LanguageProps } from '@/components/types';
import SanityCloudinaryImage from '@/components/sanity/SanityCloudinaryImage';
import { notFound } from 'next/navigation';
import { GetSingleEventsQueryResult } from '@/projects/sanity/sanity.types';
import { getServerTranslation } from '@/i18n';
import { extractInternationalI18nString } from '@/lib/sanity/helpers';
import { Language } from '@/i18n/settings';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import { getSingleEventsQuery } from '@/projects/sanity/types/queries/event';
import SanityBlock from '@/components/sanity/SanityBlock';

const getEventInformation = async (slug: string) => {
  const response = await client.fetch<GetSingleEventsQueryResult>(getSingleEventsQuery, { slug });
  return response;
};

export async function generateMetadata(props: EventPageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng, slug } = params;
  const event = await getEventInformation(slug);

  const metadataPage = getMetadataPageInfo(lng as Language, 'home');
  return metadataPage;
}

type EventPageProps = { params: Promise<LanguageProps & { slug: string }> };

const EventPage = async (props: EventPageProps) => {
  const params = await props.params;
  const { lng, slug } = params;
  if (!slug) return notFound();

  const event = await getEventInformation(slug);
  const { t } = await getServerTranslation(lng, 'art');
  if (!event) notFound();

  return (
    <>
      <HawkStarsSection className='flex gap-8 bg-bege-light pb-8 pt-10 max-lg:flex-col max-lg:px-0 max-lg:pt-0'>
        {event.name && <h1 className='text-h1_semibold mt-4 text-center'>{(event.name, lng)}</h1>}
        {event.description && <SanityBlock block={event.description} lng={params.lng} />}
        {/* <div className='max-lg:mx-auto lg:w-7/12'>
          <SanityCloudinaryImage image={event?.image} className='rounded-xl' />
        </div> */}
      </HawkStarsSection>
    </>
  );
};

export default EventPage;
