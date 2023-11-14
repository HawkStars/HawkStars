import { useTranslation } from '@/app/i18n';
import GlobalVillageArquitecture from '@/components/GlobalVillage/Arquitecture/Arquitecture';
import GlobalVillageObjectives from '@/components/GlobalVillage/Objetives/Objetives';
import Test from '@/components/GlobalVillage/test';

const VillagePage = async ({
  params: { lng },
}: {
  params: { lng: string };
}) => {
  const { t } = await useTranslation(lng, 'training_center');
  return (
    <>
      <Test />
      <GlobalVillageObjectives t={t} />
      <GlobalVillageArquitecture />
    </>
  );
};

export default VillagePage;
