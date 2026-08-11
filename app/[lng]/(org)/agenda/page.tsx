import { HawkStarsSection } from '@/components/layout';
import { LanguagePageProps } from '../types';
import { Language } from '@/i18n/settings';
import { getServerTranslation } from '@/i18n';
import AgendaCalendar from '@/components/agenda/AgendaCalendar';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng as Language, 'agenda');
  return metadataPage;
}

// `lng` is enumerated by the layout's `generateStaticParams`, so awaiting
// `params` is prerenderable here — `getServerTranslation` was the only thing
// making this route blocking, exactly as in the layout's SkipToContent. It
// resolves a dynamic `import()` of the locale JSON, which counts as uncached
// data reached outside a boundary. The body depends on nothing but `lng`, so
// caching it makes the page fully static instead of a streaming hole.
const AgendaPage = async (props: LanguagePageProps) => {
  const { lng } = await props.params;
  return <AgendaContent lng={lng} />;
};

async function AgendaContent({ lng }: { lng: string }) {
  // 'use cache';
  const { t } = await getServerTranslation(lng as Language, 'agenda');

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
        <AgendaCalendar translations={translations} lng={lng as Language} />
      </div>
    </HawkStarsSection>
  );
}

export default AgendaPage;
