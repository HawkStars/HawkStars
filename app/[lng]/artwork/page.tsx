import { LanguagePageProps } from '../types';
import { transformUrl } from '@/utils/paths';
import Link from 'next/link';
import { getServerTranslation } from '@/i18n';
import Image from 'next/image';
import classNames from 'classnames';
import { getAllArtworkImagesQuery } from '@/lib/payload/queries/artwork';
import { Media } from '@/payload-types';
import { Language } from '@/i18n/settings';

const getArtwork = async (locale: Language) => {
  const images = await getAllArtworkImagesQuery(locale);
  return images;
};

const ArtworkPage = async (props: LanguagePageProps) => {
  const params = await props.params;
  const { lng } = params;
  const { t } = await getServerTranslation(lng, 'art');

  const artworkImages = await getArtwork(lng);
  const { docs } = artworkImages;

  return (
    <section className='mt-5 flex flex-col gap-4 lg:mt-10'>
      <h1 className='text-h1_semibold font-oswald text-green text-center'>{t('artwork.pieces')}</h1>
      <div className='mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-x-20 gap-y-12 lg:mt-20 lg:grid-cols-2'>
        {docs.map((item, index) => {
          const artTitle = item.title;
          const artworkImage = item.image as Media;
          return (
            <Link href={transformUrl(lng, `/artwork/${item.slug}`)} key={item.slug || index}>
              <div className='flex h-full flex-col gap-5'>
                <h3 className='text-h2_bold font-oswald text-disabled text-center'>{item.title}</h3>
                {artworkImage?.url && (
                  <div className={classNames('relative my-auto flex h-full align-middle')}>
                    <Image
                      src={artworkImage?.url}
                      alt={artTitle}
                      width={500}
                      height={500}
                      className='rounded-md'
                    />
                    {item.is_sold && (
                      <div className='bg-red-dark text-oswald text-h2_bold absolute right-2 bottom-2 rounded-xl px-3 py-1 text-white'>
                        {t('sold')}
                      </div>
                    )}
                  </div>
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
