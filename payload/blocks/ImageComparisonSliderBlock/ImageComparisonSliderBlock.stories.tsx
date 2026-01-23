import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ImageComparisonSliderBlock } from './Component';

const meta: Meta<typeof ImageComparisonSliderBlock> = {
  title: 'Media/Image Comparison Slider Block V2',
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
      imageType: 'external',
      externalImage:
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=675&fit=crop',
      alt: 'Before image',
    },
    afterImage: {
      imageType: 'external',
      externalImage:
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=675&fit=crop',
      alt: 'After image',
    },
    beforeLabel: 'Before',
    afterLabel: 'After',
  },
};
