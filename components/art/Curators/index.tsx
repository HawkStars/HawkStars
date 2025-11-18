import { LanguageProps } from '@/components/types';

import Link from 'next/link';
import { allCuratorsQuery } from '@/lib/payload/queries/artwork';
import { Language } from '@/i18n/settings';
import { Curator, Media } from '@/payload-types';
import Image from 'next/image';

const getCurators = async (locale: Language) => {
  const response = await allCuratorsQuery(locale);
  return response;
};

const Curators = async ({ lng }: LanguageProps) => {
  const allCurators = await getCurators(lng);
  const { docs: curators } = allCurators;

  return (
    <>
      <section className='my-20 flex justify-center gap-4 max-lg:flex-col lg:gap-32' id='curators'>
        {curators.map((curator: Curator) => {
          return (
            <div key={curator.id}>
              <Link href={`/${lng}/curator/${curator.slug}`} className='flex flex-col gap-5'>
                <div className='md:mx-auto'>
                  <Image
                    src={(curator.image as Media)?.url || ''}
                    alt={(curator.image as Media)?.alt || 'Event Image'}
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
