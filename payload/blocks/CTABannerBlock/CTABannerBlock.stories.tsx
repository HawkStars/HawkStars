import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CTABannerBlock } from './Component';
import { createPayloadLink } from '@/utils/storybook';

const meta: Meta<typeof CTABannerBlock> = {
  title: 'Call To Action/CTABannerBlock',
  component: CTABannerBlock,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof CTABannerBlock>;

export const Centered: Story = {
  args: {
    title: 'Ready to Make a Difference?',
    description: 'Join us in building a better future for young people in our community.',
    links: [
      {
        link: createPayloadLink('reference', '#', false, 'Get Started'),
      },
      {
        link: createPayloadLink('custom', '#', false, 'Learn More'),
      },
    ],
    variant: 'centered',
  },
};

export const Split: Story = {
  args: {
    ...Centered.args,
    variant: 'split',
  },
};

export const ImageBackground: Story = {
  args: {
    ...Centered.args,
    variant: 'image-bg',
    backgroundImage: {
      imageType: 'external',
      alt: 'Background Image',
      externalImage:
        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=600&fit=crop',
    },
  },
};
