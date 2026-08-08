import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { getAllArtworkImagesQuery } from '@/lib/payload/queries/artwork';
import { Media } from '@/payload-types';
import { ImageMedia } from '@/payload/components/Media';
import { transformUrl } from '@/utils/paths';
import Link from 'next/link';

export async function ArtworkWrapper({ locale }: { locale: Language }) {
  const images = await getAllArtworkImagesQuery(locale);
  const { docs } = images;
  const { t } = await getServerTranslation(locale, 'art');

  return (
    <div className='mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-x-20 gap-y-12 lg:mt-20 lg:grid-cols-2'>
      {docs.map((item, index) => {
        const artTitle = item.title;
        const artworkImage = item.image as Media;
        return (
          <Link href={transformUrl(locale, `/artwork/${item.slug}`)} key={item.slug || index}>
            <div className='flex h-full flex-col gap-5'>
              <h2 className='text-h2_bold font-oswald text-disabled text-center'>{item.title}</h2>
              {artworkImage?.url && (
                <div className='relative my-auto flex h-full align-middle'>
                  <ImageMedia
                    resource={artworkImage}
                    alt={artTitle}
                    width={500}
                    height={500}
                    className='aspect-auto rounded-md'
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
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
  );
}
