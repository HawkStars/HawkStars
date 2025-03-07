import { HawkStarsSection } from '@/components/layout';
import { client } from '@/lib/sanity/sanityClient';
import SanityBlock from '@/components/sanity/SanityBlock';
import { LanguageProps } from '@/components/types';
import SanityCloudinaryImage from '@/components/sanity/SanityCloudinaryImage';
import { notFound } from 'next/navigation';
import { GetSingleArtworkResult } from '@/projects/sanity/sanity.types';
import { getServerTranslation } from '@/i18n';
import { extractInternationalI18nString } from '@/lib/sanity/helpers';
import Button from '@/components/utils/Button';
import ArtPropertyComponent from '@/components/art/ArtProperty';
import { Language } from '@/i18n/settings';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import { getSingleArtwork } from '@/projects/sanity/types/queries/art';

const getCuratorInformation = async (slug: string) => {
  const response = await client.fetch<GetSingleArtworkResult>(getSingleArtwork, { slug });
  return response;
};

export async function generateMetadata(props: CuratorPageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng, slug } = params;
  const artwork = await getCuratorInformation(slug);

  const metadataPage = getMetadataPageInfo(lng as Language, 'home');
  return metadataPage;
}

type CuratorPageProps = { params: Promise<LanguageProps & { slug: string }> };

const CuratorPage = async (props: CuratorPageProps) => {
  const params = await props.params;
  const { lng, slug } = params;
  if (!slug) return notFound();

  const artwork = await getCuratorInformation(slug);
  const { t } = await getServerTranslation(lng, 'art');
  if (!artwork) notFound();

  return (
    <>
      <HawkStarsSection className='flex gap-8 bg-bege-light pb-8 pt-10 max-lg:flex-col max-lg:px-0 max-lg:pt-0'>
        <div className='max-lg:mx-auto lg:w-7/12'>
          <SanityCloudinaryImage image={artwork?.image} className='rounded-xl' />
        </div>
        <div className='font-oswald flex flex-col px-5 pt-5 lg:w-5/12'>
          <h2 className='text-h1_semibold mb-2 text-disabled'>{artwork.artist}</h2>
          <h1 className='text-h1_semibold mb-10 text-disabled'>
            {extractInternationalI18nString({ text: artwork.title, lng })}
          </h1>

          <div className='my-5 grid grid-cols-2 gap-x-12 gap-y-8'>
            <ArtPropertyComponent label={t('artwork.year')} value={artwork.year} />
            <ArtPropertyComponent
              label={t('artwork.dimensions')}
              value={extractInternationalI18nString({ text: artwork.dimensions, lng })}
            />
            <ArtPropertyComponent
              label={t('artwork.settings')}
              value={extractInternationalI18nString({ text: artwork.settings, lng })}
            />
            <ArtPropertyComponent
              label={t('artwork.tiragem')}
              value={extractInternationalI18nString({ text: artwork.tiragem, lng })}
            />
          </div>
          {!artwork.is_sold && (
            <div className='mt-auto flex flex-col gap-3 max-md:mt-6'>
              <h2 className='text-h2_bold my-auto text-disabled'>
                {extractInternationalI18nString({ text: artwork.price, lng })}
              </h2>
              <a href='https://forms.gle/XA4kwkHFJvcmEduCA' target='_blank'>
                <Button type={'button'}>{t('buy')}</Button>
              </a>
              <span className='-mt-2 ml-1 opacity-90'>{t('artwork.vat_and_ports')}</span>
            </div>
          )}
          {artwork.is_sold && (
            <Button type='button' disabled variant='informative'>
              {t('sold')}
            </Button>
          )}
        </div>
      </HawkStarsSection>
      <section className='font-oswald mx-auto mt-6 flex max-w-7xl flex-col gap-4 px-4 text-justify lg:px-8'>
        <h6 className='text-h2_bold'>{t('artwork.synopsis')}</h6>
        {artwork?.synopsis && <SanityBlock block={artwork?.synopsis} lng={params.lng} />}

        <div>{artwork.extra && <SanityBlock block={artwork.extra} lng={params.lng} />}</div>
      </section>
    </>
  );
};

export default CuratorPage;
