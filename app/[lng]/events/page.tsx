import EventsList from '@/components/events/EventsList';
import { HawkStarsSection } from '@/components/layout';
import { LanguageProps } from '@/components/types';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';

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
  const { t } = await getServerTranslation(lng, 'common');

  return (
    <HawkStarsSection className='flex gap-8 bg-bege-light pb-8 pt-10 max-lg:flex-col max-lg:px-0 max-lg:pt-0'>
      <h1 className='text-h1_semibold mt-4 text-center'>{t('navbar.events')}</h1>
      <EventsList />
    </HawkStarsSection>
  );
};

export default EventsPage;
