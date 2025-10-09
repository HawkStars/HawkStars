import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import MainTeamPage from '../../../components/team/Main';
import { LanguagePageProps } from '../types';
import { Language } from '@/i18n/settings';

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng as Language, 'home');
  return metadataPage;
}

const TeamPage = async (props: { params: Promise<{ lng: string }> }) => {
  await props.params;

  return <MainTeamPage />;
};

export default TeamPage;
