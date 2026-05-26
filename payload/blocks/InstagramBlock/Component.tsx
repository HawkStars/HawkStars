import dynamic from 'next/dynamic';
import { InstagramBlock } from '@/payload-types';

// Lazy-load both variants — neither is needed for SSR or above-the-fold rendering.
// ssr:false also prevents the instagram embed.js script from blocking hydration.
const InstagramEmbedWidget = dynamic(
  () => import('@/components/socials/InstagramFeed/InstagramEmbedWidget'),
  { ssr: false }
);

const InstagramGrid = dynamic(
  () => import('@/components/socials/InstagramFeed/InstagramGrid'),
  { ssr: false }
);

export const InstagramBlockComponent: React.FC<InstagramBlock> = ({ version }) => (
  <div data-blockId='instagram'>
    {version === 'grid' ? <InstagramGrid /> : <InstagramEmbedWidget />}
  </div>
);
