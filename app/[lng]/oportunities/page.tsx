import { defaultMetadata } from '../../metadata';
import InstagramFeed from '../../../components/opportunities/instagram-feed';
import { Metadata } from 'next';

export const metadata = {
  title: 'Hawk Stars - Opportunities',
  description:
    'Available opportunities for the youth and all the people interested in the social ativities',
  ...defaultMetadata,
} as Metadata;

const OportunitiesPage = ({ params: { lng } }: { params: { lng: string } }) => {
  return (
    <>
      <div className='container-hawk mx-auto'>
        <InstagramFeed />
      </div>
    </>
  );
};

export default OportunitiesPage;
