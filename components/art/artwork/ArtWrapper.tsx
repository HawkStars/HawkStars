import { getAllArtworkImagesQuery } from '@/lib/payload/queries/artwork';
import { Language } from '@/i18n/settings';
import { ArtworkGrid } from './ArtworkGrid';

export async function ArtworkWrapper({ locale }: { locale: Language }) {
  const images = await getAllArtworkImagesQuery(locale);
  const { docs } = images;

  return <ArtworkGrid artworks={docs} locale={locale} />;
}
