import { defaultMetadata } from '../../../metadata';
import PartnersComponent from '../../../components/partners/PartnersComponent';
import { Metadata } from 'next';

export const metadata = {
  title: 'Hawk Stars - Partners',
  description: 'Partners that work directly with Hawk Stars NGO',
  ...defaultMetadata,
} as Metadata;

const PartnersPage = ({ params: { lng } }: { params: { lng: string } }) => {
  return <PartnersComponent lng={lng} />;
};

export default PartnersPage;
