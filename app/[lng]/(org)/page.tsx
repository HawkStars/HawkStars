import { Metadata } from 'next';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Language } from '@/i18n/settings';
import { HomeLanding } from '@/components/home';
import { LanguagePageProps } from './types';

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const { lng } = await props.params;
  return getMetadataPageInfo(lng as Language, 'home');
}

/** Static landing page — content lives in `i18n/locales/{pt,en}/home.json`, not in Payload. */
export default async function Home(props: LanguagePageProps) {
  const { lng } = await props.params;
  return <HomeLanding lng={lng as Language} />;
}
