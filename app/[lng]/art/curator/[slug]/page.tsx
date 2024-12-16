import { HawkStarsSection } from '@/components/layout';
import { client } from '@/sanity/lib/client';
import { getSingleCuratorQuery } from '../../queries';
import SanityBlock from '@/components/SanityBlock';
import { GetSingleCuratorQueryResult } from '@/sanity.types';
import { LanguageProps } from '@/components/types';

const getCuratorInformation = async (slug: string) => {
  const response = await client.fetch<GetSingleCuratorQueryResult>(getSingleCuratorQuery, { slug });
  return response;
};

type CuratorPageProps = { params: Promise<LanguageProps & { slug: string }> };

const CuratorPage = async (props: CuratorPageProps) => {
  const params = await props.params;
  const curator = await getCuratorInformation(params.slug);
  return (
    <HawkStarsSection>
      <h1>Curator</h1>
      <SanityBlock block={curator?.description} />
    </HawkStarsSection>
  );
};

export default CuratorPage;
