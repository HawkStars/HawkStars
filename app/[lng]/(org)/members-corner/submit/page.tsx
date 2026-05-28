import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import { LanguagePageProps } from '../../types';
import { Language } from '@/i18n/settings';
import { getServerTranslation } from '@/i18n';
import { HawkStarsSection } from '@/components/layout';
import SubmitProjectForm from '@/components/members-corner/SubmitProjectForm';

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  return getMetadataPageInfo(lng as Language, 'members_corner');
}

const SubmitMemberProjectPage = async (props: LanguagePageProps) => {
  const params = await props.params;
  const { lng } = params;
  const { t } = await getServerTranslation(lng, 'members-corner');

  return (
    <HawkStarsSection padding='none'>
      <header className='bg-green px-4 py-16 text-center xl:px-40'>
        <h1 className='text-3xl font-bold text-white lg:text-5xl'>{t('form.title')}</h1>
      </header>
      <SubmitProjectForm lng={lng} />
    </HawkStarsSection>
  );
};

export default SubmitMemberProjectPage;
