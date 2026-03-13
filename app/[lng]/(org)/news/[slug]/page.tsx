import { Language } from '@/i18n/settings';
import { getMainPageInformation } from '@/lib/payload/main-page';
import { prepareMetadataInfo, getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import { LanguagePageProps } from '../../types';

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  const pageInformation = await getMainPageInformation(lng as Language);
  if (pageInformation && pageInformation.meta) return prepareMetadataInfo(pageInformation.meta);

  const metadataPage = getMetadataPageInfo(lng as Language, 'home');
  return metadataPage;
}

const NewsSlugPage = async () => {
  return <section>A</section>;
};

export default NewsSlugPage;
