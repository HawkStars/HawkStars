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
  const { lng, slug } = params
  if(!slug) return notFound();

  const artwork = await getCuratorInformation(slug);
  const { t } = await getServerTranslation(lng, 'art');
  if (!artwork) notFound();

  debugger
  return (
    <>
      <HawkStarsSection className='flex bg-bege-light pt-10 max-lg:flex-col max-lg:px-0 max-lg:pt-0 gap-8 pb-8'>
        <div className='max-lg:mx-auto w-7/12'>
          <SanityCloudinaryImage image={artwork?.image} />
        </div>
        <div className='w-5/12 p-5 flex flex-col'>
          <h1 className='text-h1_semibold mb-10 text-disabled'>{extractInternationalI18nString({ block: artwork.title,lng})}</h1>
          <h2 className='text-disabled text-h2_bold px-3'>{extractInternationalI18nString({ block: artwork.price,lng})}</h2>
          <div className='grid grid-cols-2 mt-5 px-3'>
            <ArtPropertyComponent label={t("artwork.artist")} value={artwork.artist} />
            
          </div>
          <div className='mt-auto'>
            <Button type={'button'}>
              {t('buy')}
            </Button>
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
