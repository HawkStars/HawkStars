import { HawkStarsSection } from '@/components/layout';
import { client } from '@/sanity/lib/client';
import { getSingleCuratorQuery } from '../../queries';
import SanityBlock from '@/components/Sanity/SanityBlock';
import { GetSingleCuratorQueryResult } from '@/sanity.types';
import { LanguageProps } from '@/components/types';
import SanityCloudinaryImage from '@/components/Sanity/SanityCloudinaryImage';
import { notFound } from 'next/navigation';

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
    <HawkStarsSection>
      <SanityCloudinaryImage image={curator?.image} />
      <div>
        <h1>{curator.name}</h1>
        {curator?.description && <SanityBlock block={curator?.description} lng={params.lng} />}
      </div>
    </HawkStarsSection>
  );
};

export default CuratorPage;
