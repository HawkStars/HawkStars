import EventsList from '@/components/events/EventsList';
import { HawkStarsSection } from '@/components/layout';
import { LanguageProps } from '@/components/types';
import { Language } from '@/i18n/settings';
import { getEventsQuery } from '@/lib/payload/queries/event';
import { getProjectsListHeaderInfo } from '@/lib/payload/queries/globals/projectsList';
import { VideoBlock } from '@/payload/blocks/VideoBlock/Component';
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
  const searchParams = await props.searchParams;
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const { lng } = params;

  const projectListInformation = await getProjectsListHeaderInfo(lng);
  const events = await getEventsQuery(page);

  return (
    <HawkStarsSection className='bg-bege-light gap-8 pt-10 pb-8 max-lg:px-0 max-lg:pt-0 xl:px-10!'>
      <div className='container py-32'>
        <div>
          <p className='text-muted-foreground mb-1 uppercase md:text-lg'>
            {projectListInformation?.title}
          </p>
          <h1 className='text-3xl font-bold uppercase md:text-7xl'>Projects</h1>
          <p className='text-muted-foreground mt-7 max-w-2xl'>{projectListInformation?.subtitle}</p>
        </div>
        {projectListInformation.video && (
          <div className='mx-auto flex justify-center'>
            <VideoBlock videoUrl={projectListInformation.video} blockType={'videoBlock'} autoplay />
          </div>
        )}
      </div>

      <EventsList events={events} />
      {/* missing pagination logic */}
      {/* {totalPages > page && <Link href={`/events?page=${page + 1}`}>Next Page</Link>} */}
    </HawkStarsSection>
  );
};

export default EventsPage;
