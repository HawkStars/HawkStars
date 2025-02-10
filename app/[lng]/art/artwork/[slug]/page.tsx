import { HawkStarsSection } from '@/components/layout';
import { client } from '@/lib/sanity/sanityClient';
import { getSingleArtwork, getSingleCuratorQuery } from '../../queries';
import SanityBlock from '@/components/Sanity/SanityBlock';
import { GetSingleCuratorQueryResult } from '@/lib/sanity/sanity.types';
import { LanguageProps } from '@/components/types';
import SanityCloudinaryImage from '@/components/Sanity/SanityCloudinaryImage';
import { notFound } from 'next/navigation';

const getCuratorInformation = async (slug: string) => {
  const response = await client.fetch<GetSingleCuratorQueryResult>(getSingleArtwork, { slug });
  return response;
};

type CuratorPageProps = { params: Promise<LanguageProps & { slug: string }> };

const CuratorPage = async (props: CuratorPageProps) => {
  const params = await props.params;
  const artwork = await getCuratorInformation(params.slug);
  debugger;
  if (!artwork) notFound();

  return (
    <>
      <HawkStarsSection className='flex bg-bege-light pt-10 max-lg:flex-col max-lg:px-0 max-lg:pt-0'>
        <div className='max-lg:mx-auto lg:m-5 lg:w-96'>
          <SanityCloudinaryImage image={artwork?.image} />
        </div>
        <div className='w-full p-5'>
          <h1 className='text-h2_bold mb-5'>{artwork.name}</h1>
          <div className='grid grid-cols-2'></div>
        </div>
      </HawkStarsSection>
      <section>
        {artwork?.description && <SanityBlock block={artwork?.description} lng={params.lng} />}
      </section>
    </>
  );
};

export default CuratorPage;
