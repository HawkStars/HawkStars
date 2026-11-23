import { Metadata } from 'next';
import SedeBlender from '@/components/sede3d/SedeBlender';
import { SITE_NAME } from '@/lib/constants';

/**
 * Test page for the headquarters model built in Blender (GLB in public/models). Kept out of
 * search: noindex/nofollow here, disallowed in robots.ts, not in the sitemap or the navigation.
 */
export const metadata: Metadata = {
  title: `Sede HawkStars · modelo Blender | ${SITE_NAME}`,
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

const SedeBlenderPage = () => <SedeBlender />;

export default SedeBlenderPage;
