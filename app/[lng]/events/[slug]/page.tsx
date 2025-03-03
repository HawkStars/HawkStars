import { HawkStarsSection } from '@/components/layout';
import { client } from '@/lib/sanity/sanityClient';
import SanityBlock from '@/components/sanity/SanityBlock';
import { LanguageProps } from '@/components/types';
import SanityCloudinaryImage from '@/components/sanity/SanityCloudinaryImage';
import { notFound } from 'next/navigation';
import { getSingleArtwork } from '@/projects/sanity/models/queries/art';
import { GetSingleArtworkResult } from '@/projects/sanity/sanity.types';
import { getServerTranslation } from '@/i18n';
import { extractInternationalI18nString } from '@/lib/sanity/helpers';
import Button from '@/components/utils/Button';
import ArtPropertyComponent from '@/components/art/ArtProperty';
import { Language } from '@/i18n/settings';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import { getSingleEventsQuery } from '@/projects/sanity/models/queries/event';

const getEventInformation = async (slug: string) => {
  const response = await client.fetch<GetSingleArtworkResult>(getSingleEventsQuery, { slug });
  return response;
};

export async function generateMetadata(props: CuratorPageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng, slug } = params;
  const artwork = await getEventInformation(slug);

  const metadataPage = getMetadataPageInfo(lng as Language, 'home');
  return metadataPage;
}

type CuratorPageProps = { params: Promise<LanguageProps & { slug: string }> };

const CuratorPage = async (props: CuratorPageProps) => {
  const params = await props.params;
  const { lng, slug } = params;
  if (!slug) return notFound();

  const event = await getEventInformation(slug);
  const { t } = await getServerTranslation(lng, 'art');
  if (!event) notFound();

  return (
    <>
      <HawkStarsSection className='flex gap-8 bg-bege-light pb-8 pt-10 max-lg:flex-col max-lg:px-0 max-lg:pt-0'>
        <div className='max-lg:mx-auto lg:w-7/12'>
          <SanityCloudinaryImage image={event?.image} className='rounded-xl' />
        </div>
        <div className='font-oswald flex flex-col px-5 pt-5 lg:w-5/12'>
          <h1 className='text-h1_semibold mb-10 text-disabled'>
            {extractInternationalI18nString({ text: event.title, lng })}
          </h1>
        </div>
      </HawkStarsSection>
    </>
  );
};

export default CuratorPage;
