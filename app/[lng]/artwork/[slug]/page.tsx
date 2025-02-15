import { HawkStarsSection } from '@/components/layout';
import { client } from '@/lib/sanity/sanityClient';
import SanityBlock from '@/components/Sanity/SanityBlock';
import { LanguageProps } from '@/components/types';
import SanityCloudinaryImage from '@/components/Sanity/SanityCloudinaryImage';
import { notFound } from 'next/navigation';
import { getSingleArtwork } from '@/projects/sanity/sanity/queries/art';
import { GetSingleArtworkResult } from '@/projects/sanity/sanity.types';
import { getServerTranslation } from '@/i18n';
import { extractInternationalI18nString } from '@/lib/sanity/helpers';
import Button from '@/components/utils/Button';
import ArtPropertyComponent from '@/components/art/ArtProperty';

const getCuratorInformation = async (slug: string) => {
  const response = await client.fetch<GetSingleArtworkResult>(getSingleArtwork, { slug });
  return response;
};

type CuratorPageProps = { params: Promise<LanguageProps & { slug: string }> };

const CuratorPage = async (props: CuratorPageProps) => {
  const params = await props.params;
  const { lng, slug } = params;
  if (!slug) return notFound();

  const artwork = await getCuratorInformation(slug);
  const { t } = await getServerTranslation(lng, 'art');
  if (!artwork) notFound();

  debugger;
  return (
    <>
      <HawkStarsSection className='flex gap-8 bg-bege-light pb-8 pt-10 max-lg:flex-col max-lg:px-0 max-lg:pt-0'>
        <div className='max-lg:mx-auto lg:w-7/12'>
          <SanityCloudinaryImage image={artwork?.image} />
        </div>
        <div className='flex w-5/12 flex-col p-5'>
          <h2 className='text-h1_semibold mb-2 text-disabled'>{artwork.artist}</h2>
          <h1 className='text-h1_semibold mb-10 text-disabled'>
            {extractInternationalI18nString({ text: artwork.title, lng })}
          </h1>
          <h2 className='text-h2_bold px-3 text-disabled'>
            {extractInternationalI18nString({ text: artwork.price, lng })}
          </h2>
          <div className='mt-5 grid grid-cols-2 px-3'></div>
          <div className='ml-2 mt-auto'>
            {artwork.is_sold ? (
              <Button type='button'>{t('sold')}</Button>
            ) : (
              <Button type={'button'}>{t('buy')}</Button>
            )}
          </div>
        </div>
      </HawkStarsSection>
      <section className='mx-auto mt-4 flex max-w-7xl flex-col gap-4 px-8'>
        <h6 className='text-h2_bold'>{t('artwork.synopsis')}</h6>
        {artwork?.synopsis && <SanityBlock block={artwork?.synopsis} lng={params.lng} />}
      </section>
    </>
  );
};

export default CuratorPage;
