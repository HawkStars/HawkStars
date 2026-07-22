import { Metadata } from 'next';
import { getMetadataPageInfo, prepareMetadataInfo } from '@/utils/metadata';
import { LanguagePageProps } from './types';
import { Language } from '@/i18n/settings';
import { hawkLogo } from '@/utils/models/images/logos';
import { ImageMedia } from '@/payload/components/Media';
import { getMainPageInformation } from '@/lib/payload/main-page';
import RichTextWrapper from '@/payload/components/RichText/RichTextWrapper';
import MainPageBanner from '@/components/main-page/MainPageBanner';

export const revalidate = 600; // invalidate every 10 minutes

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
  const params = await props.params;
  const { lng } = params;
  const pageInformation = await getMainPageInformation(lng as Language);

  if (!pageInformation || !pageInformation.layout) {
    return (
      <div className='mt-20 flex w-full flex-col items-center justify-center gap-20'>
        <ImageMedia src={hawkLogo} alt='Hawk Stars Logo' />
        <h1 className='text-xl'>We are revamping the website. See you soon!</h1>
      </div>
    );
  } else {
    const banner = pageInformation.bannerFields || {};
    return (
      <>
        {banner && <MainPageBanner {...banner} />}
        <RichTextWrapper data={pageInformation.layout} />
      </>
    );
  }
}
