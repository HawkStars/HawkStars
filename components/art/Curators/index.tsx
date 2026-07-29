import { LanguageProps } from '@/components/types';

import Link from 'next/link';
import { allCuratorsQuery } from '@/lib/payload/queries/artwork';
import { Language } from '@/i18n/settings';
import { Curator } from '@/payload-types';
import { ImageMedia } from '@/payload/components/Media';

const getCurators = async (locale: Language) => {
  const response = await allCuratorsQuery(locale);
  return response;
};

const Curators = async ({ lng }: LanguageProps) => {
  const allCurators = await getCurators(lng);
  const { docs: curators } = allCurators;

  return (
    <>
      <section
        className='my-20 flex justify-center gap-4 max-lg:flex-col lg:mx-auto lg:gap-32'
        id='curators'
      >
        {curators.map((curator: Curator) => {
          return (
            <Link
              href={`/${lng}/curator/${curator.slug}`}
              className='flex w-auto flex-col gap-5'
              key={curator.id}
            >
              <div className='mx-auto flex justify-center'>
                <ImageMedia
                  resource={curator.image}
                  alt={curator.name}
                  height={384}
                  width={384}
                  fill={false}
                  className='aspect-square rounded-lg object-cover'
                />
              </div>
              <h6 className='text-h2_bold max-lg:pl-4 md:text-center'>{curator.name}</h6>
            </Link>
          );
        })}
      </section>
    </>
  );
};

export default Curators;
