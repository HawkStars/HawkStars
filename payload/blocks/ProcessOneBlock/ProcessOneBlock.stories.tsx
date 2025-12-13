import type { Meta, StoryObj } from '@storybook/react';
import { ProcessOneBlock } from './ProcessOneBlockComponent';

const meta: Meta<typeof ProcessOneBlock> = {
  title: 'Payload Blocks/ProcessOneBlock',
  component: ProcessOneBlock,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof ProcessOneBlock>;

export const Default: Story = {
  args: {
    title: 'Our Process',
    description: 'Follow our simple three-step process to get started',
    ctaText: 'Get in touch',
    steps: [
      {
        step: '01',
        title: 'Discovery',
        description:
          'We learn about your business goals, challenges, and requirements to create a tailored solution.',
        id: '1',
      },
      {
        step: '02',
        title: 'Development',
        description:
          'Our expert team builds your solution using industry best practices and cutting-edge technology.',
        id: '2',
      },
      {
        step: '03',
        title: 'Delivery',
        description: 'We launch your project and provide ongoing support to ensure your success.',
        id: '3',
      },
    ],
    id: '1',
    blockName: 'ProcessOneBlock',
    blockType: 'processOneBlock',
  },
};

export const FourSteps: Story = {
  args: {
    title: 'How It Works',
    description: 'Our proven methodology ensures success',
    ctaText: 'Start Now',
    steps: [
      {
        step: '01',
        title: 'Plan',
        description: 'Define objectives and create a roadmap.',
        id: '1',
      },
      {
        step: '02',
        title: 'Design',
        description: 'Create beautiful and functional designs.',
        id: '2',
      },
      {
        step: '03',
        title: 'Build',
        description: 'Develop with quality and speed.',
        id: '3',
      },
      {
        step: '04',
        title: 'Launch',
        description: 'Deploy and monitor performance.',
        id: '4',
      },
    ],
    id: '2',
    blockName: 'ProcessOneBlock',
    blockType: 'processOneBlock',
  },
};

export const NoDescription: Story = {
  args: {
    title: 'Simple Steps',
    ctaText: 'Contact Us',
    steps: [
      {
        step: '01',
        title: 'Sign Up',
        description: 'Create your account in seconds.',
        id: '1',
      },
      {
        step: '02',
        title: 'Configure',
        description: 'Set up your preferences.',
        id: '2',
      },
      {
        step: '03',
        title: 'Go Live',
        description: 'Start using the platform.',
        id: '3',
      },
    ],
    id: '3',
    blockName: 'ProcessOneBlock',
    blockType: 'processOneBlock',
  },
};
