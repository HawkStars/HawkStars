import { HawkStarsSection } from '@/components/layout';

import { LanguageProps } from '@/components/types';
import { notFound } from 'next/navigation';
import { getSingleCuratorQuery } from '@/lib/payload/queries/artwork';
import { Language } from '@/i18n/settings';
import Image from 'next/image';
import { Media } from '@/payload-types';
import RichText from '@/payload/components/RichText';
import { connection } from 'next/server';
import { Metadata } from 'next';

export const revalidate = 600; // invalidate every 10 minutes

type CuratorPageProps = { params: Promise<LanguageProps & { slug: string }> };

export async function generateMetadata(props: CuratorPageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng, slug } = params;
  const curator = await getSingleCuratorQuery(slug, lng);

  if (!curator) {
    return {
      title: 'Curator Not Found',
      description: 'The requested curator profile could not be found.',
    };
  }

  const hasDescriptionContent =
    curator.description && Array.isArray(curator.description) && curator.description.length > 0;

  return {
    title: `${curator.name} - Curator | Hawk Stars NGO`,
    description: hasDescriptionContent
      ? `Learn about ${curator.name}, curator at Hawk Stars NGO Social Impact Art Gallery.`
      : `${curator.name} - Curator at Hawk Stars NGO Social Impact Art Gallery in Pinhel, Portugal.`,
    keywords: [
      'Hawk Stars NGO',
      'Curator',
      curator.name || 'Unknown Curator',
      'Art Gallery',
      'Social Impact',
    ],
    openGraph: {
      title: `${curator.name} - Curator | Hawk Stars NGO`,
      description: `${curator.name} - Curator at Hawk Stars NGO Social Impact Art Gallery`,
      images:
        curator.image && (curator.image as Media)?.url
          ? [(curator.image as Media).url as string]
          : [],
    },
  };
}

const getCuratorInformation = async (slug: string, locale: Language) => {
  const response = await getSingleCuratorQuery(slug, locale);
  return response;
};

const CuratorPage = async (props: CuratorPageProps) => {
  await connection();
  const params = await props.params;
  const { lng, slug } = params;
  const curator = await getCuratorInformation(slug, lng);
  if (!curator) notFound();

  return (
    <HawkStarsSection className='font-oswald bg-bege-light flex pt-10 max-lg:flex-col max-lg:px-0 max-lg:pt-0'>
      <div className='max-lg:mx-auto lg:m-5 lg:w-96'>
        {curator.image && (
          <Image
            src={(curator.image as Media)?.url || ''}
            alt={curator.name || 'Curator Image'}
            width={384}
            height={512}
            className='rounded-xl'
          />
        )}
      </div>
      <div className='w-full p-5'>
        <h1 className='text-h2_bold mb-5'>{curator.name}</h1>
        {curator.description && <RichText data={curator.description} />}
      </div>
    </HawkStarsSection>
  );
};

export default CuratorPage;
