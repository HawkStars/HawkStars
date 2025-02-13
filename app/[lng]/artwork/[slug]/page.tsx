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

const getCuratorInformation = async (slug: string) => {
  const response = await client.fetch<GetSingleArtworkResult>(getSingleArtwork, { slug });
  return response;
};

type CuratorPageProps = { params: Promise<LanguageProps & { slug: string }> };

const CuratorPage = async (props: CuratorPageProps) => {
  const params = await props.params;
  const { lng, slug } = params
  if(!slug) return notFound();

  const artwork = await getCuratorInformation(slug);
  const { t } = await getServerTranslation(lng, 'art');
  if (!artwork) notFound();

  debugger
  return (
    <>
      <HawkStarsSection className='flex bg-bege-light pt-10 max-lg:flex-col max-lg:px-0 max-lg:pt-0'>
        <div className='max-lg:mx-auto lg:m-5 lg:w-96'>
          <SanityCloudinaryImage image={artwork?.image} />
        </div>
        <div className='w-full p-5'>
          <h1 className='text-h2_bold mb-5'>{extractInternationalI18nString({ block: artwork.title,lng})}</h1>
          <h2>{extractInternationalI18nString({ block: artwork.price,lng})}</h2>
          <div className='grid grid-cols-2'>
            <div className='text-h2_light'>{t("artwork.artist")}</div>
            <span>{artwork.artist}</span>
          </div>
        </div>
      </HawkStarsSection>
      <section className='flex flex-col mt-4 max-w-7xl mx-auto px-8 gap-4'>
        <h6 className='text-h2_bold'>{t("artwork.synopsis")}</h6>
        {artwork?.synopsis && <SanityBlock block={artwork?.synopsis} lng={params.lng} />}
      </section>
    </>
  );
};

export default CuratorPage;
