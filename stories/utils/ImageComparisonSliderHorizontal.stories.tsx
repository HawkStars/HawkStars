import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ImageComparisonSlider } from '@/components/ui/image-comparison-slider-horizontal';

const meta = {
  title: 'UI/ImageComparisonSlider',
  component: ImageComparisonSlider,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    initialPosition: {
      control: { type: 'range', min: 0, max: 100 },
    },
  },
} satisfies Meta<typeof ImageComparisonSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    leftImage: 'https://picsum.photos/seed/before/1200/800',
    rightImage: 'https://picsum.photos/seed/after/1200/800?grayscale',
    altLeft: 'Before',
    altRight: 'After',
  },
};

export const StartFromLeft: Story = {
  args: {
    leftImage: 'https://picsum.photos/seed/before/1200/800',
    rightImage: 'https://picsum.photos/seed/after/1200/800?grayscale',
    initialPosition: 10,
  },
};

export const StartFromRight: Story = {
  args: {
    leftImage: 'https://picsum.photos/seed/before/1200/800',
    rightImage: 'https://picsum.photos/seed/after/1200/800?grayscale',
    initialPosition: 90,
  },
};
