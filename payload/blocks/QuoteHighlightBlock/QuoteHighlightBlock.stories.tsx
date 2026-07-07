import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QuoteHighlightBlock } from './Component';

const meta: Meta<typeof QuoteHighlightBlock> = {
  title: 'Blocks/Content/Quote Highlight',
  component: QuoteHighlightBlock,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    style: {
      control: 'select',
      options: ['centered', 'bordered', 'highlighted'],
      description: 'Visual treatment of the quote',
    },
    quote: { control: 'text' },
    author: { control: 'text' },
    authorTitle: { control: 'text' },
    blockType: { table: { disable: true } },
    id: { table: { disable: true } },
    blockName: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof QuoteHighlightBlock>;

export const Centered: Story = {
  args: {
    quote:
      'This organization has transformed my life. The support and opportunities they provide are incredible.',
    author: 'Sofia Rodrigues',
    authorTitle: 'Program Participant',
    style: 'centered',
    id: '1',
    blockName: 'QuoteHighlightBlock',
    blockType: 'quoteHighlight',
  },
};

export const Bordered: Story = {
  args: { ...Centered.args, style: 'bordered', id: '2' },
};

export const Highlighted: Story = {
  args: { ...Centered.args, style: 'highlighted', id: '3' },
};

export const WithPhoto: Story = {
  args: {
    ...Centered.args,
    id: '4',
    authorPhoto: {
      imageType: 'external',
      externalImage:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      alt: 'Sofia Rodrigues',
    },
  },
};

export const WithPhotoBordered: Story = {
  args: {
    ...Centered.args,
    style: 'bordered',
    id: '5',
    authorPhoto: {
      imageType: 'external',
      externalImage:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      alt: 'Sofia Rodrigues',
    },
  },
};

export const LongQuote: Story = {
  args: {
    ...Centered.args,
    style: 'highlighted',
    id: '6',
    quote:
      'Working with this organization has been one of the most rewarding experiences of my professional life. The team is passionate, dedicated, and always striving to create meaningful impact in the community. Their programs have helped hundreds of young people find their path and build the confidence they need to succeed.',
  },
};

export const NoAuthor: Story = {
  args: {
    quote: 'Together we build something greater than ourselves.',
    style: 'centered',
    id: '7',
    blockName: 'QuoteHighlightBlock',
    blockType: 'quoteHighlight',
  },
};
