import GlobalVillageArquitecture from '../../../components/GlobalVillage/Arquitecture/Arquitecture';
import GlobalVillageObjectives from '../../../components/GlobalVillage/Objetives/Objetives';
import Test from '../../../components/GlobalVillage/test';

const VillagePage = async ({
  params: { lng },
}: {
  params: { lng: string };
}) => {
  return (
    <section className='flex flex-col gap-8'>
      <Test />
      <GlobalVillageObjectives lng={lng} />
      <GlobalVillageArquitecture />
    </section>
  );
};

export default VillagePage;
