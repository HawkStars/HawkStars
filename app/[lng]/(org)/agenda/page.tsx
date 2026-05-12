import { HawkStarsSection } from '@/components/layout';
import { LanguagePageProps } from '../types';
import { Language } from '@/i18n/settings';
import { getServerTranslation } from '@/i18n';
import { getAgendaEventsQuery } from '@/lib/payload/queries/agenda';
import AgendaCalendar from '@/components/agenda/AgendaCalendar';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';

export const revalidate = 600; // invalidate every 10 minutes

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng as Language, 'agenda');
  return metadataPage;
}

const AgendaPage = async (props: LanguagePageProps) => {
  const params = await props.params;
  const { lng } = params;
  const { t } = await getServerTranslation(lng, 'agenda');

  const events = await getAgendaEventsQuery(lng as Language);

  const translations = {
    title: t('title'),
    subtitle: t('subtitle'),
    noEvents: t('noEvents'),
    today: t('today'),
    viewProject: t('viewProject'),
    multiDay: t('multiDay'),
    monthNames: [
      t('months.january'),
      t('months.february'),
      t('months.march'),
      t('months.april'),
      t('months.may'),
      t('months.june'),
      t('months.july'),
      t('months.august'),
      t('months.september'),
      t('months.october'),
      t('months.november'),
      t('months.december'),
    ],
    dayNames: [
      t('days.sun'),
      t('days.mon'),
      t('days.tue'),
      t('days.wed'),
      t('days.thu'),
      t('days.fri'),
      t('days.sat'),
    ],
  };

  return (
    <HawkStarsSection className='bg-bege-light gap-8 pt-10 pb-8 max-lg:px-0 max-lg:pt-0 xl:px-10!'>
      <div className='container'>
        <AgendaCalendar events={events} translations={translations} lng={lng} />
      </div>
    </HawkStarsSection>
  );
};

export default AgendaPage;
