import type { Meta, StoryObj } from '@storybook/react';
import { MediaBlock } from './Component';

const meta: Meta<typeof MediaBlock> = {
  title: 'Payload Blocks/Media/ImageBlock',
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
      id: '1',
      alt: 'Sample image',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
      filename: 'sample.jpg',
      mimeType: 'image/jpeg',
      filesize: 123456,
      width: 1200,
      height: 800,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    id: '1',
    blockName: 'MediaBlock',
    blockType: 'mediaBlock',
  },
};

export const WithoutGutter: Story = {
  args: {
    ...Default.args,
    enableGutter: false,
  },
};

export const CustomClassName: Story = {
  args: {
    ...Default.args,
    className: 'my-16',
    imgClassName: 'shadow-2xl',
  },
};
