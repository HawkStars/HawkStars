import { AboutBlock, AboutBlockProps } from './Component';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof AboutBlock> = {
  title: 'Payload Blocks/AboutBlock',
  component: AboutBlock,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof AboutBlock>;

export const Default: Story = {
  args: {
    title: 'A different kind of bank.',
    description:
      "We're on a mission to transform financial services by harnessing vast amounts of untapped financial data.",
    image: {
      url: 'https://placehold.co/600x400',
      alt: 'Placeholder image',
    },
  },
};
