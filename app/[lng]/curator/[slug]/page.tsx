import { HawkStarsSection } from '@/components/layout';
import { client } from '@/lib/sanity/sanityClient';

import SanityBlock from '@/components/sanity/SanityBlock';
import { LanguageProps } from '@/components/types';
import SanityCloudinaryImage from '@/components/sanity/SanityCloudinaryImage';
import { notFound } from 'next/navigation';
import { GetSingleCuratorQueryResult } from '@/projects/sanity/sanity.types';
import { getSingleCuratorQuery } from '@/projects/sanity/types/groq/art';

const getCuratorInformation = async (slug: string) => {
  const response = await client.fetch<GetSingleCuratorQueryResult>(getSingleCuratorQuery, { slug });
  return response;
};

type CuratorPageProps = { params: Promise<LanguageProps & { slug: string }> };

const CuratorPage = async (props: CuratorPageProps) => {
  const params = await props.params;
  const curator = await getCuratorInformation(params.slug);
  if (!curator) notFound();

  return (
    <HawkStarsSection className='font-oswald flex bg-bege-light pt-10 max-lg:flex-col max-lg:px-0 max-lg:pt-0'>
      <div className='max-lg:mx-auto lg:m-5 lg:w-96'>
        <SanityCloudinaryImage image={curator?.image} />
      </div>
      <div className='w-full p-5'>
        <h1 className='text-h2_bold mb-5'>{curator.name}</h1>
        {curator?.description && <SanityBlock block={curator?.description} lng={params.lng} />}
      </div>
    </HawkStarsSection>
  );
};

export default CuratorPage;
