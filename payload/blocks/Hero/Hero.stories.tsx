import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HeroBlock } from './Component';

const meta: Meta<typeof HeroBlock> = {
  title: 'Hero/Simple',
  component: HeroBlock,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof HeroBlock>;

export const Default: Story = {
  args: {
    badge: 'PLATFORM',
    heading: 'Build amazing experiences with our powerful platform',
    ctaLink: {
      type: 'custom',
      url: '/get-started',
      newTab: false,
      label: 'Get started',
    },
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
  },
};

export const WithHeaderImage: Story = {
  args: {
    ...Default.args,
    headerImage: {
      imageType: 'external',
      externalImage:
        'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=128&h=128&fit=crop',
      alt: 'Header image showing a futuristic cityscape',
    },
  },
};

export const NoBadge: Story = {
  args: {
    heading: 'Welcome to the future of development',
    ctaLink: {
      type: 'custom',
      url: '/get-started',
      newTab: false,
      label: 'Get started',
    },
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
  },
};

export const NoFeatures: Story = {
  args: {
    badge: 'NEW RELEASE',
    heading: 'Introducing our revolutionary platform',
    ctaLink: {
      type: 'custom',
      url: '/get-started',
      newTab: false,
      label: 'Get started',
    },
  },
};
