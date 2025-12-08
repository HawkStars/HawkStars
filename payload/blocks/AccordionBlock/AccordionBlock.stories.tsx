import type { Meta, StoryObj } from '@storybook/react';
import { AccordionBlock } from './Component';
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical';

const meta: Meta<typeof AccordionBlock> = {
  title: 'Payload Blocks/AccordionBlock',
  component: AccordionBlock,
  parameters: {
    layout: 'fullscreen',
  },
  tags: [],
};

export default meta;
type Story = StoryObj<typeof AccordionBlock>;

const sampleContent = {
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: 'This is the detailed content for this accordion item. It can contain rich text formatting.',
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
    items: [
      {
        title: 'What is this platform about?',
        content: sampleContent as DefaultTypedEditorState,
        defaultOpen: false,
        id: '1',
      },
      {
        title: 'How do I get started?',
        content: sampleContent as DefaultTypedEditorState,
        defaultOpen: false,
        id: '2',
      },
      {
        title: 'What are the pricing options?',
        content: sampleContent as DefaultTypedEditorState,
        defaultOpen: false,
        id: '3',
      },
    ],
    allowMultipleOpen: false,
  },
};

export const WithDefaultOpen: Story = {
  args: {
    items: [
      {
        title: 'This item is open by default',
        content: sampleContent as DefaultTypedEditorState,
        defaultOpen: true,
        id: '1',
      },
      {
        title: 'This item is closed',
        content: sampleContent as DefaultTypedEditorState,
        defaultOpen: false,
        id: '2',
      },
    ],
    allowMultipleOpen: false,
  },
};

export const AllowMultipleOpen: Story = {
  args: {
    items: [
      {
        title: 'Feature 1',
        content: sampleContent as DefaultTypedEditorState,
        defaultOpen: false,
        id: '1',
      },
      {
        title: 'Feature 2',
        content: sampleContent as DefaultTypedEditorState,
        defaultOpen: false,
        id: '2',
      },
      {
        title: 'Feature 3',
        content: sampleContent as DefaultTypedEditorState,
        defaultOpen: false,
        id: '3',
      },
    ],
    allowMultipleOpen: true,
  },
};

export const SingleItem: Story = {
  args: {
    items: [
      {
        title: 'Single Accordion Item',
        content: sampleContent as DefaultTypedEditorState,
        defaultOpen: false,
        id: '1',
      },
    ],
    allowMultipleOpen: false,
  },
};
