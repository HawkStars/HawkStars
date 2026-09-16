import { InstagramBlock } from '@/payload-types';
import { InstagramEmbedWidget, InstagramGrid } from '@/components/socials/InstagramFeed';

export const InstagramBlockComponent: React.FC<InstagramBlock> = ({ version, sectionId }) => (
  <div id={sectionId || undefined} data-blockid='instagram'>
    {version === 'grid' ? <InstagramGrid /> : <InstagramEmbedWidget />}
  </div>
);
