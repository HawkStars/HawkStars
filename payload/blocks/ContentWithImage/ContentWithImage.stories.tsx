import type { Meta, StoryObj } from '@storybook/react';
import { ContentWithImageBlock } from './Component';

const meta: Meta<typeof ContentWithImageBlock> = {
  title: 'Payload Blocks/ContentWithImage',
  component: ContentWithImageBlock,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    imagePosition: {
      control: 'select',
      options: ['left', 'right'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ContentWithImageBlock>;

const sampleDescription = {
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: 'This is a content block with rich text description. It can include various formatting options and multiple paragraphs to provide detailed information.',
          },
        ],
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
};

export const ImageRight: Story = {
  args: {
    title: 'Powerful Features',
    description: sampleDescription,
    image: {
      id: '1',
      alt: 'Feature image',
      url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop',
      filename: 'feature.jpg',
      mimeType: 'image/jpeg',
      filesize: 123456,
      width: 800,
      height: 600,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    imagePosition: 'right',
    id: '1',
    blockName: 'ContentWithImage',
    blockType: 'contentWithImage',
  },
};

export const ImageLeft: Story = {
  args: {
    title: 'Amazing Technology',
    description: sampleDescription,
    image: {
      id: '2',
      alt: 'Technology image',
      url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
      filename: 'tech.jpg',
      mimeType: 'image/jpeg',
      filesize: 123456,
      width: 800,
      height: 600,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    imagePosition: 'left',
    id: '2',
    blockName: 'ContentWithImage',
    blockType: 'contentWithImage',
  },
};
