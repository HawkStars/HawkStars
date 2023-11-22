import { defaultMetadata } from '@/metadata';
import GlobalVillageArquitecture from '../../../components/GlobalVillage/Arquitecture/Arquitecture';
import GlobalVillageObjectives from '../../../components/GlobalVillage/Objetives/Objetives';

import Test from '../../../components/GlobalVillage/test';

import type { Metadata, ResolvingMetadata } from 'next';
import { LanguagePageProps } from '../types';
import GlobalVillageBanner from '@/components/GlobalVillage/Banner/Banner';
import GlobalVillageAboutSection from '@/components/GlobalVillage/GlobalVillageAboutSection/GlobalVillageAboutSection';

export async function generateMetadata(
  { params }: LanguagePageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { lng } = params;

  const messagesJson = await import(`@/i18n/locales/${lng}/metadata.json`);
  const villageInfo = messagesJson['village'];

  return {
    title: villageInfo.title || 'Hawk Stars',
    description: villageInfo.description || '',
    ...defaultMetadata,
  };
}

const VillagePage = async ({
  params: { lng },
}: {
  params: { lng: string };
}) => {
  return (
    <section className='flex flex-col gap-8'>
      <Test />
      <GlobalVillageBanner lng={lng} />
      <GlobalVillageAboutSection lng={lng} />
      <GlobalVillageObjectives lng={lng} />
      <GlobalVillageArquitecture lng={lng} />
    </section>
  );
};

export default VillagePage;
