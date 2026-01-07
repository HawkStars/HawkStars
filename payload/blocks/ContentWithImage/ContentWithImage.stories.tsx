import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ContentWithImageBlock } from './Component';
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical';
import { createPayloadExternalImage } from '@/utils/storybook';

const meta: Meta<typeof ContentWithImageBlock> = {
  title: 'Section/Content With Image',
  component: ContentWithImageBlock,
  parameters: {
    layout: 'fullscreen',
  },
  tags: [],
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
    description: sampleDescription as DefaultTypedEditorState,
    image: createPayloadExternalImage(
      'external',
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop',
      'Feature image'
    ),
    imagePosition: 'right',
  },
};

export const ImageLeft: Story = {
  args: {
    title: 'Amazing Technology',
    description: sampleDescription as DefaultTypedEditorState,
    image: createPayloadExternalImage(
      'external',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
      'Technology image'
    ),
    imagePosition: 'left',
  },
};
