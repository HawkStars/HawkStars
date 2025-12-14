import { SideBySideComparison } from './Component';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SideBySideComparison> = {
  title: 'Payload Blocks/ImageBlocks/ImageComparisonBlock',
  component: SideBySideComparison,
};

export default meta;

type Story = StoryObj<typeof SideBySideComparison>;

export const Default: Story = {
  args: {
    afterImage: {
      imageType: 'external',
      externalImage: 'https://placehold.co/400x400?text=Right',
      alt: 'Left image',
      image: null,
    },
    beforeImage: {
      imageType: 'external',
      externalImage: 'https://placehold.co/400x400?text=Left',
      alt: 'Right image',
      image: null,
    },
    initialSliderPosition: 50,
  },
};
