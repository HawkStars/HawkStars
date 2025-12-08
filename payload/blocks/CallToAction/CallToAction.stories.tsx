import type { Meta, StoryObj } from '@storybook/react';
import { CallToActionBlock } from './Component';

const meta: Meta<typeof CallToActionBlock> = {
  title: 'Payload Blocks/CallToAction',
  component: CallToActionBlock,
  parameters: {
    layout: 'fullscreen',
  },
  tags: [],
};

export default meta;
type Story = StoryObj<typeof CallToActionBlock>;

export const Default: Story = {
  args: {
    title: 'Ready to get started?',
    subtitle: 'Join thousands of teams already using our platform to build amazing products.',
    links: [
      {
        link: {
          type: 'custom',
          label: 'Get Started',
          url: '/signup',
        },
      },
      {
        link: {
          type: 'custom',
          label: 'Learn More',
          url: '/about',
        },
      },
    ],
    id: '1',
    blockName: 'CallToAction',
    blockType: 'cta',
  },
};

export const SingleButton: Story = {
  args: {
    title: 'Start your journey today',
    subtitle: 'Transform your workflow with our innovative solution.',
    links: [
      {
        link: {
          type: 'custom',
          label: 'Sign Up Now',
          url: '/signup',
        },
      },
    ],
    id: '2',
  },
};

export const NoSubtitle: Story = {
  args: {
    title: 'Join the revolution',
    links: [
      {
        link: {
          type: 'custom',
          label: 'Get Started',
          url: '/signup',
        },
      },
    ],
    id: '3',
  },
};
