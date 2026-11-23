import { Metadata } from 'next';
import SedeWalkthrough from '@/components/sede3d/walkthrough/SedeWalkthrough';
import { MOCK_TRAINING_ROOM_SIGNS } from '@/components/sede3d/walkthrough/trainingRoomSigns';
import { SITE_NAME } from '@/lib/constants';

/**
 * First-person walkthrough of the architect's Revit model of the headquarters (converted for the
 * web by revit_glb.py, public/models/sede-revit.glb). A test page: noindex
 * and nofollow here, disallowed in robots.ts, not in the sitemap or the navigation.
 *
 * The training-room signs are mock data for now; they will come from Payload (sponsor or
 * partner logos linked to each room), fetched here on the server and passed down.
 */
export const metadata: Metadata = {
  title: `Sede HawkStars · visita virtual | ${SITE_NAME}`,
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

const SedeWalkthroughPage = () => <SedeWalkthrough signs={MOCK_TRAINING_ROOM_SIGNS} />;

export default SedeWalkthroughPage;
