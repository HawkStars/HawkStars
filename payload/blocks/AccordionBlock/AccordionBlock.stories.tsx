import type { Meta, StoryObj } from '@storybook/react';
import { AccordionBlock } from './Component';

const meta: Meta<typeof AccordionBlock> = {
  title: 'Payload Blocks/AccordionBlock',
  component: AccordionBlock,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
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
        content: sampleContent,
        defaultOpen: false,
        id: '1',
      },
      {
        title: 'How do I get started?',
        content: sampleContent,
        defaultOpen: false,
        id: '2',
      },
      {
        title: 'What are the pricing options?',
        content: sampleContent,
        defaultOpen: false,
        id: '3',
      },
    ],
    allowMultipleOpen: false,
    id: '1',
    blockName: 'AccordionBlock',
    blockType: 'accordionBlock',
  },
};

export const WithDefaultOpen: Story = {
  args: {
    items: [
      {
        title: 'This item is open by default',
        content: sampleContent,
        defaultOpen: true,
        id: '1',
      },
      {
        title: 'This item is closed',
        content: sampleContent,
        defaultOpen: false,
        id: '2',
      },
    ],
    allowMultipleOpen: false,
    id: '2',
    blockName: 'AccordionBlock',
    blockType: 'accordionBlock',
  },
};

export const AllowMultipleOpen: Story = {
  args: {
    items: [
      {
        title: 'Feature 1',
        content: sampleContent,
        defaultOpen: false,
        id: '1',
      },
      {
        title: 'Feature 2',
        content: sampleContent,
        defaultOpen: false,
        id: '2',
      },
      {
        title: 'Feature 3',
        content: sampleContent,
        defaultOpen: false,
        id: '3',
      },
    ],
    allowMultipleOpen: true,
    id: '3',
    blockName: 'AccordionBlock',
    blockType: 'accordionBlock',
  },
};

export const SingleItem: Story = {
  args: {
    items: [
      {
        title: 'Single Accordion Item',
        content: sampleContent,
        defaultOpen: false,
        id: '1',
      },
    ],
    allowMultipleOpen: false,
    id: '4',
    blockName: 'AccordionBlock',
    blockType: 'accordionBlock',
  },
};
