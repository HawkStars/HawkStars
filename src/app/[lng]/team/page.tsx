import { defaultMetadata } from '@/app/metadata';
import MainTeamPage from '@/components/team/Main';
import { Metadata } from 'next';

export const metadata = {
  title: 'Hawk Stars - Team',
  description:
    'The members of the board member, financial and main board that manage this non profit organization',
  ...defaultMetadata,
} as Metadata;

const TeamPage = ({ params: { lng } }: { params: { lng: string } }) => {
  return <MainTeamPage />;
};

export default TeamPage;
