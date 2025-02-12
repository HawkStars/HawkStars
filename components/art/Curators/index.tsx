
import SanityCloudinaryImage from '@/components/Sanity/SanityCloudinaryImage';
import { LanguageProps } from '@/components/types';
import { client } from '@/lib/sanity/sanityClient';
import { AllCuratorsQueryResult } from '@/projects/sanity/sanity.types';
import { allCuratorsQuery } from '@/projects/sanity/sanity/queries/art';
import Link from 'next/link';

const getCurators = async () => {
  const response = await client.fetch<AllCuratorsQueryResult>(allCuratorsQuery);
  return response;
};

const Curators = async ({ lng }: LanguageProps) => {
  const allCurators = await getCurators();

  return (
    <>
      <section className='flex justify-center my-20 lg:gap-32 gap-4 max-lg:flex-col'>
        {allCurators.map((curator) => {
          return <div key={curator._id}>
            <Link href={`/${lng}/curator/${curator.slug?.current}`} className='flex flex-col gap-5'>
              <div className='md:mx-auto'>
                <SanityCloudinaryImage image={curator.image} className='lg:h-[400px] max-lg:w-96 lg:rounded-md'/>
              </div>
              <h6 className='text-h2_bold max-lg:pl-4 md:text-center'>{curator.name}</h6>
              </Link>
            </div>
          
        })}
      </section>
    </>
  );
};

export default Curators;
