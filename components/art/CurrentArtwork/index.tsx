import { LanguageProps } from '@/components/types';
import { getServerTranslation } from '@/i18n';
import { allArtwork } from '@/lib/payload/queries/artwork';
import { Media } from '@/payload-types';

import Link from 'next/link';

const fetchLatestArtwork = async () => {
  const response = await allArtwork();
  return response;
};

const CurrentArtwork = async ({ lng }: LanguageProps) => {
  const { t } = await getServerTranslation(lng, 'art');

  const latestArtwork = await fetchLatestArtwork();

  const artwork = latestArtwork[0] || undefined;
  const artworkImage = artwork?.image as Media;
  return (
    <section className='mt-8'>
      <h2 className='lg:text-h1_semibold text-h2_bold text-green text-center max-lg:px-4'>
        {t('artwork')}
      </h2>
      <div className='mx-auto mt-5 flex flex-col justify-center gap-2 lg:w-1/2'>
        <img src={artworkImage?.url || ''} />
        <h3 className='text-h2__bold lg:text-center'>{artwork?.price}</h3>
        <Link
          href={`/${lng}/art/artwork/${artwork.slug}`}
          className='bg-green w-fit rounded-lg px-4 py-2 text-white lg:self-center'
        >
          Ver Obra
        </Link>
      </div>
    </section>
  );
};

export default CurrentArtwork;
