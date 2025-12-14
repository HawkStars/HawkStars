import type { Meta, StoryObj } from '@storybook/react';
import { ImageComparisonSliderBlock } from './Component';

const meta: Meta<typeof ImageComparisonSliderBlock> = {
  title: 'Payload Blocks/ImageComparisonSliderBlock',
  component: ImageComparisonSliderBlock,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof ImageComparisonSliderBlock>;

export const Default: Story = {
  args: {
    title: 'Our Community Transformation',
    beforeImage: {
      url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=675&fit=crop',
      alt: 'Before',
    },
    afterImage: {
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=675&fit=crop',
      alt: 'After',
    },
    beforeLabel: 'Before',
    afterLabel: 'After',
    id: '1',
    blockName: 'ImageComparisonSliderBlock',
    blockType: 'imageComparisonSlider',
  },
};
