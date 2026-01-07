import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MediaBlock } from './Component';

const meta: Meta<typeof MediaBlock> = {
  title: 'Media/Image Block',
  component: MediaBlock,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof MediaBlock>;

export const Default: Story = {
  args: {
    media: {
      externalImage:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
      imageType: 'external',
      alt: 'A beautiful landscape',
    },
  },
};
