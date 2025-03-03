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
import { allEventsQuery } from '@/projects/sanity/models/queries/event';

const getEventInformation = async () => {
  const response = await client.fetch<GetSingleArtworkResult>(allEventsQuery);
  return response;
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

  const event = await getEventInformation();
  const { t } = await getServerTranslation(lng, 'art');
  if (!event) notFound();

  return (
    <>
      <HawkStarsSection className='flex gap-8 bg-bege-light pb-8 pt-10 max-lg:flex-col max-lg:px-0 max-lg:pt-0'>
        <div className='max-lg:mx-auto lg:w-7/12'>
          <SanityCloudinaryImage image={event?.image} className='rounded-xl' />
        </div>
        <div className='font-oswald flex flex-col px-5 pt-5 lg:w-5/12'>
          <h1 className='text-h1_semibold mb-10 text-disabled'>
            {extractInternationalI18nString({ text: event.title, lng })}
          </h1>
        </div>
      </HawkStarsSection>
    </>
  );
};

export default EventsPage;
