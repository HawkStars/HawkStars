import { LanguageProps } from '@/components/types';
import { getServerTranslation } from '@/i18n';
import { client } from '@/lib/sanity/sanityClient';
import { allArtwork } from '@/projects/sanity/models/queries/art';
import Link from 'next/link';

const fetchLatestArtwork = async () => {
  const response = await client.fetch(allArtwork);
  return response;
};

const CurrentArtwork = async ({ lng }: LanguageProps) => {
  const { t } = await getServerTranslation(lng, 'art');

  const latestArtwork = await fetchLatestArtwork();

  const artwork = latestArtwork[0] || undefined;
  return (
    <section className='mt-8'>
      <h2 className='lg:text-h1_semibold text-h2_bold text-center text-green max-lg:px-4'>
        {t('artwork')}
      </h2>
      <div className='mx-auto mt-5 flex flex-col justify-center gap-2 lg:w-1/2'>
        <img src={artwork.image.url} />
        <h3 className='text-h2__bold lg:text-center'>{artwork.name}</h3>
        <Link
          href={`/${lng}/art/artwork/${artwork.slug.current}`}
          className='w-fit rounded-lg bg-green px-4 py-2 text-white lg:self-center'
        >
          Ver Obra
        </Link>
      </div>
    </section>
  );
};

export default CurrentArtwork;
