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
    <section className='grid grid-cols-1 lg:grid-cols-2'>
      <h1>{t('artwork.pieces')}</h1>
      {artworkImages.map((item) => {
        const artTitle = extractInternationalI18nString({ text: item.title, lng: lng.lng });
        return (
          <Link href={transformUrl(lng.lng, `artwork/${item.slug}`)}>
            <div>
              <h3>{artTitle}</h3>
              {item.image?.url && <Image src={item.image?.url} alt={artTitle} />}
            </div>
          </Link>
        );
      })}
    </section>
  );
};

export default ArtworkPage;
