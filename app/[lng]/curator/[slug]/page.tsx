import { HawkStarsSection } from '@/components/layout';

import { LanguageProps } from '@/components/types';
import { notFound } from 'next/navigation';
import { getSingleCuratorQuery } from '@/lib/payload/queries/artwork';
import { Language } from '@/i18n/settings';
import Image from 'next/image';
import { Media } from '@/payload-types';
import { RichTextViewer } from '@/components/richtext';

const getCuratorInformation = async (slug: string, locale: Language) => {
  const response = await getSingleCuratorQuery(slug, locale);
  return response;
};

type CuratorPageProps = { params: Promise<LanguageProps & { slug: string }> };

const CuratorPage = async (props: CuratorPageProps) => {
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
        {curator.description && <RichTextViewer data={curator.description} />}
      </div>
    </HawkStarsSection>
  );
};

export default CuratorPage;
