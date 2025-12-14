import { Metadata } from 'next';
import { getMetadataPageInfo } from '@/utils/metadata';
import { LanguagePageProps } from './types';
import { Language } from '@/i18n/settings';
import { hawkLogo } from '@/utils/models/images/logos';
import Image from 'next/image';

export const revalidate = 7200; // 2 hours

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng as Language, 'home');
  return metadataPage;
}

type HomeProps = {
  params: Promise<{ lng: Language }>;
};

export default async function Home(_props: HomeProps) {
  return (
    <div className='mt-20 flex w-full flex-col items-center justify-center gap-20'>
      <Image src={hawkLogo} alt='Hawk Stars Logo' />
      <h1 className='text-xl'>We are revamping the website. See you soon!</h1>
    </div>
  );
}
