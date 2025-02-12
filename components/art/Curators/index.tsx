
import { LanguageProps } from '@/components/types';
import { client } from '@/lib/sanity/sanityClient';
import { AllCuratorsQueryResult } from '@/projects/sanity/sanity.types';
import { allCuratorsQuery } from '@/projects/sanity/sanity/queries/art';

const getCurators = async () => {
  const response = await client.fetch<AllCuratorsQueryResult>(allCuratorsQuery);
  return response;
};

const Curators = async ({ lng }: LanguageProps) => {
  const allCurators = await getCurators();

  return (
    <>
      <section className='grid grid-cols-2'>
        {allCurators.map((curator) => {
          debugger;
          return <div key={curator._id}></div>;
        })}
      </section>
    </>
  );
};

export default Curators;
