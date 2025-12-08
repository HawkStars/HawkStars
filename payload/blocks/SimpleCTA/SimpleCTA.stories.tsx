import type { Meta, StoryObj } from '@storybook/react';
import { SimpleCTABlockComponent as SimpleCTABlock } from './SimpleCTAComponent';

const meta: Meta<typeof SimpleCTABlock> = {
  title: 'Payload Blocks/SimpleCTA',
  component: SimpleCTABlock,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof SimpleCTABlock>;

export const Default: Story = {
  args: {
    heading: 'Ready to Transform Your Business?',
    description: 'Join thousands of companies that trust our platform to scale their operations.',
    buttons: {
      primary: {
        text: 'Get Started',
        url: '/signup',
      },
      secondary: {
        text: 'Schedule a Demo',
        url: '/demo',
      },
    },
    id: '1',
    blockName: 'SimpleCTA',
    blockType: 'simpleCta',
  },
};

export const SingleButton: Story = {
  args: {
    heading: 'Start Your Free Trial Today',
    description: 'No credit card required. Get started in minutes.',
    buttons: {
      primary: {
        text: 'Start Free Trial',
        url: '/trial',
      },
    },
    id: '2',
    blockName: 'SimpleCTA',
    blockType: 'simpleCta',
  },
};

export const ShortCopy: Story = {
  args: {
    heading: "Let's Get Started",
    description: 'Take the first step towards success.',
    buttons: {
      primary: {
        text: 'Begin Now',
        url: '/start',
      },
      secondary: {
        text: 'Learn More',
        url: '/about',
      },
    },
    id: '3',
    blockName: 'SimpleCTA',
    blockType: 'simpleCta',
  },
};
