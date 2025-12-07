import type { Meta, StoryObj } from '@storybook/react';
import { HeroBlock } from './Component';

const meta: Meta<typeof HeroBlock> = {
  title: 'Payload Blocks/Hero',
  component: HeroBlock,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof HeroBlock>;

export const Default: Story = {
  args: {
    badge: 'PLATFORM',
    heading: 'Build amazing experiences with our powerful platform',
    ctaText: 'Start now for free',
    ctaLink: '/signup',
    features: [
      {
        icon: 'globe',
        title: 'Global Reach',
        description: 'Connect with users worldwide through our distributed infrastructure.',
      },
      {
        icon: 'rocket',
        title: 'Lightning Fast',
        description: 'Optimized performance ensures your users get the best experience.',
      },
      {
        icon: 'expand',
        title: 'Scalable',
        description: 'Grow from zero to millions without worrying about infrastructure.',
      },
      {
        icon: 'wrench',
        title: 'Customizable',
        description: 'Adapt our platform to your specific needs with powerful tools.',
      },
    ],
    id: '1',
    blockName: 'Hero',
    blockType: 'hero',
  },
};

export const WithHeaderImage: Story = {
  args: {
    ...Default.args,
    headerImage: {
      id: '1',
      alt: 'Logo',
      url: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=128&h=128&fit=crop',
      filename: 'logo.png',
      mimeType: 'image/png',
      filesize: 5000,
      width: 128,
      height: 128,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
};

export const NoBadge: Story = {
  args: {
    heading: 'Welcome to the future of development',
    ctaText: 'Get started',
    ctaLink: '/start',
    features: [
      {
        icon: 'rocket',
        title: 'Fast Setup',
        description: 'Get up and running in minutes with our intuitive interface.',
      },
      {
        icon: 'wrench',
        title: 'Full Control',
        description: 'Complete flexibility to customize every aspect of your project.',
      },
    ],
    id: '2',
    blockName: 'Hero',
    blockType: 'hero',
  },
};

export const NoFeatures: Story = {
  args: {
    badge: 'NEW RELEASE',
    heading: 'Introducing our revolutionary platform',
    ctaText: 'Learn more',
    ctaLink: '/features',
    id: '3',
    blockName: 'Hero',
    blockType: 'hero',
  },
};
