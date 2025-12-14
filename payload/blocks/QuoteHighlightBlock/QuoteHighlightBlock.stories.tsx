import type { Meta, StoryObj } from '@storybook/react';
import { QuoteHighlightBlock } from './Component';

const meta: Meta<typeof QuoteHighlightBlock> = {
  title: 'Payload Blocks/QuoteHighlightBlock',
  component: QuoteHighlightBlock,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof QuoteHighlightBlock>;

export const Centered: Story = {
  args: {
    quote: 'This organization has transformed my life. The support and opportunities they provide are incredible.',
    author: 'Sofia Rodrigues',
    authorTitle: 'Program Participant',
    style: 'centered',
    id: '1',
    blockName: 'QuoteHighlightBlock',
    blockType: 'quoteHighlight',
  },
};

export const Bordered: Story = {
  args: {
    ...Centered.args,
    style: 'bordered',
  },
};

export const Highlighted: Story = {
  args: {
    ...Centered.args,
    style: 'highlighted',
  },
};

export const WithPhoto: Story = {
  args: {
    ...Centered.args,
    authorPhoto: {
      url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      alt: 'Sofia Rodrigues',
    },
  },
};
