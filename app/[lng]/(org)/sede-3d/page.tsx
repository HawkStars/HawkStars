import { Metadata } from 'next';
import SedeBlender from '@/components/sede3d/SedeBlender';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Language } from '@/i18n/settings';
import { LanguagePageProps } from '../types';

/**
 * The future headquarters (the Global Village building) as an interactive 3D model, built in
 * Blender and loaded as a GLB. Public and indexable — localized title/description, canonical,
 * hreflang and `index, follow` come from metadata.json — and listed in the sitemap, but not in
 * the navigation.
 */
export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const { lng } = await props.params;
  return getMetadataPageInfo(lng as Language, 'sede3d');
}

const Sede3DPage = () => <SedeBlender />;

export default Sede3DPage;
