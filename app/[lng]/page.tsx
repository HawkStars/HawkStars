import { Metadata } from 'next';
import { getMetadataPageInfo, prepareMetadataInfo } from '@/utils/metadata';
import { LanguagePageProps } from './types';
import { Language } from '@/i18n/settings';
import { hawkLogo } from '@/utils/models/images/logos';
import Image from 'next/image';
import { getMainPageInformation } from '@/lib/payload/main-page';
import RichTextWrapper from '@/payload/components/RichText/RichTextWrapper';
import { headers } from 'next/headers';

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  const pageInformation = await getMainPageInformation(lng as Language);
  if (pageInformation && pageInformation.meta) return prepareMetadataInfo(pageInformation.meta);

  const metadataPage = getMetadataPageInfo(lng as Language, 'home');
  return metadataPage;
}

type HomeProps = {
  params: Promise<{ lng: Language }>;
};

export default async function Home(props: HomeProps) {
  await headers();
  const params = await props.params;
  const { lng } = params;
  const pageInformation = await getMainPageInformation(lng as Language);

  if (!pageInformation || !pageInformation.layout) {
    return (
      <div className='mt-20 flex w-full flex-col items-center justify-center gap-20'>
        <Image src={hawkLogo} alt='Hawk Stars Logo' />
        <h1 className='text-xl'>We are revamping the website. See you soon!</h1>
      </div>
    );
  } else return <RichTextWrapper data={pageInformation.layout} />;
}
