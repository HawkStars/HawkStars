import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import { LanguagePageProps } from '../types';
import { Language } from '@/i18n/settings';
import { getServerTranslation } from '@/i18n';
import { getBoardMembers } from '@/lib/payload/queries/team';
import TeamInformation from '@/components/team/TeamInformation';

export const revalidate = 600; // invalidate every 10 minutes

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng as Language, 'home');
  return metadataPage;
}

const TeamPage = async (props: LanguagePageProps) => {
  const params = await props.params;
  const { lng } = params;
  const { t } = await getServerTranslation(lng, 'team');
  const boardMembers = await getBoardMembers();

  return (
    <div className='mt-5 flex flex-col gap-20 px-4 max-lg:gap-8 lg:mt-10'>
      {/* Header Section */}
      <div className='flex flex-col justify-center gap-4 pl-4'>
        <h1 className='text-h1_semibold'>{t('title')}</h1>
        <p className='text-body max-w-3xl text-gray-600'>{t('description')}</p>
      </div>
      <div className='flex flex-col justify-center lg:mr-4'>
        <TeamInformation boardMembers={boardMembers} lng={lng} />
      </div>
    </div>
  );
};

export default TeamPage;
