import { Metadata } from 'next';

export const metadata = {
  title: '',
  description: '',
} as Metadata;

const OportunitiesPage = ({ params: { lng } }: { params: { lng: string } }) => {
  return (
    <>
      <div className='mx-auto'></div>
    </>
  );
};

export default OportunitiesPage;
