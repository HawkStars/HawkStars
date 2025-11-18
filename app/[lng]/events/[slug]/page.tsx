import { HawkStarsSection } from '@/components/layout';

import { LanguageProps } from '@/components/types';
import { notFound } from 'next/navigation';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import { getSingleEventsQuery } from '@/lib/payload/queries/event';
import Image from 'next/image';
import { Media } from '@/payload-types';

const getEventInformation = async (slug: string, locale: Language) => {
  const response = await getSingleEventsQuery(slug, locale);
  return response;
};

export async function generateMetadata(props: EventPageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng, slug } = params;
  const event = await getEventInformation(slug, lng);

  const metadataPage = getMetadataPageInfo(lng as Language, 'home');
  return metadataPage;
}

type EventPageProps = { params: Promise<LanguageProps & { slug: string }> };

const EventPage = async (props: EventPageProps) => {
  const params = await props.params;
  const { lng, slug } = params;
  if (!slug) return notFound();

  const event = await getEventInformation(slug, lng);
  if (!event) notFound();

  return (
    <>
      <HawkStarsSection className='bg-bege-light flex gap-8 pt-10 pb-8 max-lg:flex-col max-lg:px-0 max-lg:pt-0'>
        {event.title && <h1 className='text-h1_semibold mt-4 text-center'>{event.title}</h1>}
        <div className='max-lg:mx-auto lg:w-7/12'>
          <Image
            src={(event?.image as Media)?.url || ''}
            alt={(event.image as Media)?.alt || 'Event Image'}
            className='rounded-xl'
          />
        </div>
      </HawkStarsSection>
    </>
  );
};

export default EventPage;
