import SanityCloudinaryImage from '@/components/sanity/SanityCloudinaryImage';
import { LanguageProps } from '@/components/types';
import { client } from '@/lib/sanity/sanityClient';
import { AllCuratorsQueryResult } from '@/projects/sanity/sanity.types';
import { allCuratorsQuery } from '@/projects/sanity/models/types/groq/art';
import Link from 'next/link';

const getCurators = async () => {
  const response = await client.fetch<AllCuratorsQueryResult>(allCuratorsQuery);
  return response;
};

const Curators = async ({ lng }: LanguageProps) => {
  const allCurators = await getCurators();

  return (
    <>
      <section className='my-20 flex justify-center gap-4 max-lg:flex-col lg:gap-32' id='curators'>
        {allCurators.map((curator) => {
          return (
            <div key={curator._id}>
              <Link
                href={`/${lng}/curator/${curator.slug?.current}`}
                className='flex flex-col gap-5'
              >
                <div className='md:mx-auto'>
                  <SanityCloudinaryImage
                    image={curator.image}
                    className='max-lg:w-96 lg:h-[400px] lg:rounded-md'
                  />
                </div>
                <h6 className='text-h2_bold max-lg:pl-4 md:text-center'>{curator.name}</h6>
              </Link>
            </div>
          );
        })}
      </section>
    </>
  );
};

export default Curators;
