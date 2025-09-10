import { HawkStarsSection } from '@/components/layout';

import { LanguageProps } from '@/components/types';
import { notFound } from 'next/navigation';
import SanityBlock from '@/components/utils/sanity/SanityBlock';
import SanityCloudinaryImage from '@/components/utils/sanity/SanityCloudinaryImage';
import { getSingleCuratorQuery } from '@/lib/payload/queries/artwork';

const getCuratorInformation = async (slug: string) => {
  const response = await getSingleCuratorQuery();
  return response;
};

type CuratorPageProps = { params: Promise<LanguageProps & { slug: string }> };

const CuratorPage = async (props: CuratorPageProps) => {
  const params = await props.params;
  const curator = await getCuratorInformation(params.slug);
  if (!curator) notFound();

  return (
    <HawkStarsSection className='font-oswald bg-bege-light flex pt-10 max-lg:flex-col max-lg:px-0 max-lg:pt-0'>
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
