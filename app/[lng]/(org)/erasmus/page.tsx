import { LanguageProps } from '@/components/types';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { getMetadataPageInfo } from '@/utils/metadata';
import { HawkStarsSection } from '@/components/layout';
import { Metadata } from 'next';

type ErasmusPageProps = {
  params: Promise<LanguageProps>;
};

export async function generateMetadata(props: ErasmusPageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  return getMetadataPageInfo(lng as Language, 'erasmus');
}

const ErasmusPage = async (props: ErasmusPageProps) => {
  const params = await props.params;
  const { lng } = params;

  const { t } = await getServerTranslation(lng, 'erasmus');

  return (
    <HawkStarsSection>
      <div className='container py-20 md:py-32'>
        <h1 className='text-h1_semibold text-green text-left'>{t('title')}</h1>
        <p className='text-body_regular mt-4'>{t('subtitle')}</p>
      </div>
    </HawkStarsSection>
  );
};

export default ErasmusPage;
