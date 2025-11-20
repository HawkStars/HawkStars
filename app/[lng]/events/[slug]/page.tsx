import { HawkStarsSection } from '@/components/layout';

import { LanguageProps } from '@/components/types';
import { notFound } from 'next/navigation';
import { Language } from '@/i18n/settings';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import { getSingleEventsQuery } from '@/lib/payload/queries/event';
import Image from 'next/image';
import { Media } from '@/payload-types';
import RichText from '@/payload/components/RichText';

export async function generateMetadata(props: EventPageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng, slug } = params;
  const event = await getSingleEventsQuery(slug);

  const metadataPage = getMetadataPageInfo(lng as Language, 'home');
  return metadataPage;
}

type EventPageProps = { params: Promise<LanguageProps & { slug: string }> };

const EventPage = async (props: EventPageProps) => {
  const params = await props.params;
  const { slug } = params;
  if (!slug) return notFound();

  const event = await getSingleEventsQuery(slug);
  if (!event) notFound();

  return (
    <>
      <HawkStarsSection className='bg-bege-light gap-8 pt-10 pb-8 max-lg:flex-col max-lg:px-0 max-lg:pt-0'>
        {event.title && <h1 className='text-h1_semibold mt-4 text-center'>{event.title}</h1>}
        <div className='relative lg:w-6/12'>
          <Image
            src={(event?.image as Media)?.url || ''}
            alt={(event.image as Media)?.alt || 'Event Image'}
            className='rounded-xl'
            fill={true}
          />
        </div>
        {event.page_content && <RichText data={event.page_content} />}
      </HawkStarsSection>
    </>
  );
};

export default EventPage;
