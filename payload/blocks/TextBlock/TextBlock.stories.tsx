import type { Meta, StoryObj } from '@storybook/react';
import { TextBlock } from './Component';
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical';

const meta: Meta<typeof TextBlock> = {
  title: 'Payload Blocks/TextBlock',
  component: TextBlock,
  parameters: {
    layout: 'fullscreen',
  },

  argTypes: {
    textAlign: {
      control: 'select',
      options: ['left', 'center', 'right', 'justify'],
    },
    maxWidth: {
      control: 'select',
      options: ['full', 'large', 'medium', 'small'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextBlock>;

const sampleContent = {
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: 'This is a sample text block with rich text content. ',
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: 'It can contain multiple paragraphs and formatted text.',
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

export const Default: Story = {
  args: {
    content: sampleContent as DefaultTypedEditorState,
    textAlign: 'left',
    maxWidth: 'large',
    id: '1',
    blockName: 'TextBlock',
    blockType: 'textBlock',
  },
};

export const CenterAligned: Story = {
  args: {
    ...Default.args,
    textAlign: 'center',
  },
};

export const SmallWidth: Story = {
  args: {
    ...Default.args,
    maxWidth: 'small',
  },
};

export const FullWidth: Story = {
  args: {
    ...Default.args,
    maxWidth: 'full',
  },
};

export const RightAligned: Story = {
  args: {
    ...Default.args,
    textAlign: 'right',
  },
};
