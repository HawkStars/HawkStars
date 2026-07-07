import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import HawkImage from '@/components/ui/hawk-image';

const meta = {
  title: 'Design System/Hawk Image',
  component: HawkImage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    width: { control: { type: 'number' } },
    height: { control: { type: 'number' } },
  },
} satisfies Meta<typeof HawkImage>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleSrc = 'https://picsum.photos/seed/hawkstars/600/400';

export const Default: Story = {
  args: {
    src: sampleSrc,
    alt: 'Sample landscape',
    width: 600,
    height: 400,
  },
};

export const Square: Story = {
  args: {
    src: 'https://picsum.photos/seed/hawkstars-square/400/400',
    alt: 'Sample square image',
    width: 400,
    height: 400,
  },
};

export const Rounded: Story = {
  args: {
    src: sampleSrc,
    alt: 'Rounded sample image',
    width: 600,
    height: 400,
    className: 'rounded-xl',
  },
};
