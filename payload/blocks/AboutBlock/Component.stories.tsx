import { AboutBlock } from './Component';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof AboutBlock> = {
  title: 'Section/AboutBlock',
  component: AboutBlock,
};
export default meta;

type Story = StoryObj<typeof AboutBlock>;

export const Default: Story = {
  args: {
    title: 'A different kind of bank.',
    description:
      "We're on a mission to transform financial services by harnessing vast amounts of untapped financial data.",
    imageField: {
      imageType: 'external',
      externalImage: 'https://placehold.co/600x400',
      alt: 'Placeholder image',
    },
  },
};
