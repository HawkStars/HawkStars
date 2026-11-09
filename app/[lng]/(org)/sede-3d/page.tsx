import { Metadata } from 'next';
import Sede3D from '@/components/sede3d/Sede3D';

/**
 * Preview of the future headquarters as an interactive 3D model.
 * Shared by link only: kept out of search engines, the sitemap and the navigation.
 */
export const metadata: Metadata = {
  title: 'Sede HawkStars em 3D',
  description: 'Modelo 3D aproximado da futura sede da Associação HawkStars em Pinhel.',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

const Sede3DPage = () => <Sede3D />;

export default Sede3DPage;
