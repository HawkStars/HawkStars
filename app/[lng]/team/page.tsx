import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import MainTeamPage from '../../../components/team/Main';
import { LanguagePageProps } from '../types';

export async function generateMetadata({
  params,
}: LanguagePageProps): Promise<Metadata> {
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng, 'home');
  return metadataPage;
}

const TeamPage = ({ params: { lng } }: { params: { lng: string } }) => {
  return <MainTeamPage />;
};

export default TeamPage;
