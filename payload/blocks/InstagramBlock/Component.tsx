import { InstagramEmbedWidget, InstagramGrid } from '@/components/socials/InstagramFeed';
import { InstagramBlock } from '@/payload-types';

export const InstagramBlockComponent: React.FC<InstagramBlock> = ({ version }) => (
  <div data-blockId='instagram'>
    {version === 'grid' ? <InstagramGrid /> : <InstagramEmbedWidget />}
  </div>
);
