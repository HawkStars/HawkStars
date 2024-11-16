import GlobalVillageArquitecture from '../../../components/GlobalVillage/Arquitecture/Arquitecture';
import GlobalVillageObjectives from '../../../components/GlobalVillage/Objetives/Objetives';

import type { Metadata } from 'next';
import { LanguagePageProps } from '../types';
import GlobalVillageBanner from '@/components/GlobalVillage/Banner/Banner';
import GlobalVillageAboutSection from '@/components/GlobalVillage/GlobalVillageAboutSection/GlobalVillageAboutSection';
import GlobalVillageProject from '@/components/GlobalVillage/Project/GlobalVillageProject';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Language } from '@/i18n/settings';

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng as Language, 'global_village');
  return metadataPage;
}

const VillagePage = async (props: { params: Promise<{ lng: Language }> }) => {
  const params = await props.params;
  const { lng } = params;

  return (
    <section className='flex flex-col'>
      <GlobalVillageProject lng={lng} />
      <GlobalVillageBanner lng={lng} />
      <GlobalVillageAboutSection lng={lng} />
      <GlobalVillageObjectives lng={lng} />
      <GlobalVillageArquitecture lng={lng} />
    </section>
  );
};

export default VillagePage;
