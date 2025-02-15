import { client } from '@/lib/sanity/sanityClient';
import { GetAllArtworkImagesQueryResult } from '@/projects/sanity/sanity.types';
import { getAllArtworkImagesQuery } from '@/projects/sanity/sanity/queries/art';
import { LanguagePageProps } from '../types';
import { transformUrl } from '@/utils/paths';
import Link from 'next/link';
import { getServerTranslation } from '@/i18n';
import Image from 'next/image';
import { extractInternationalI18nString } from '@/lib/sanity/helpers';

const getArtwork = async () => {
  const images = await client.fetch<GetAllArtworkImagesQueryResult>(getAllArtworkImagesQuery);
  return images;
};

const ArtworkPage = async (props: LanguagePageProps) => {
  const lng = await props.params;
  const { t } = await getServerTranslation(lng.lng, 'art');

  const artworkImages = await getArtwork();

  return (
    <section className='mt-5 flex flex-col gap-4 lg:mt-10'>
      <h1 className='text-h1_semibold text-center text-green'>{t('artwork.pieces')}</h1>
      <div className='mx-auto mt-8 grid max-w-7xl grid-cols-1 lg:grid-cols-2'>
        {artworkImages.map((item, index) => {
          const artTitle = extractInternationalI18nString({ text: item.title, lng: lng.lng });
          return (
            <Link
              href={transformUrl(lng.lng, `/artwork/${item.slug?.current}`)}
              key={item.slug?.current || index}
            >
              <div className='flex flex-col gap-4'>
                <h3 className='text-h2_bold text-center text-disabled'>{artTitle}</h3>
                {item.image?.url && (
                  <Image src={item.image?.url} alt={artTitle} width={500} height={500} />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default ArtworkPage;
