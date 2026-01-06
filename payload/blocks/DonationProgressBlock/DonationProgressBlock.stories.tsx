import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DonationProgressBlock } from './Component';

const meta: Meta<typeof DonationProgressBlock> = {
  title: 'Extra/DonationProgressBlock',
  component: DonationProgressBlock,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    theme: {
      control: 'select',
      options: ['light', 'dark', 'gradient'],
    },
    showPercentage: {
      control: 'boolean',
    },
    animateProgress: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DonationProgressBlock>;

export const Default: Story = {
  args: {
    title: 'Help Us Build Our Community Center',
    description:
      'Every contribution brings us closer to creating a space where young people can learn, grow, and connect.',
    goalAmount: 100000,
    currentAmount: 67500,
    currency: '€',
    donorCount: 234,
    ctaText: 'Donate Now',
    ctaLink: '#donate',
    showPercentage: true,
    animateProgress: true,
    theme: 'light',
    id: '1',
    blockName: 'DonationProgressBlock',
    blockType: 'donationProgress',
  },
};

export const DarkTheme: Story = {
  args: {
    ...Default.args,
    theme: 'dark',
  },
};

export const GradientTheme: Story = {
  args: {
    ...Default.args,
    theme: 'gradient',
  },
};

export const NearlyComplete: Story = {
  args: {
    ...Default.args,
    currentAmount: 95000,
    donorCount: 523,
    title: 'Almost There!',
    description: 'We are so close to reaching our goal. Your support makes all the difference.',
  },
};

export const JustStarted: Story = {
  args: {
    ...Default.args,
    currentAmount: 12000,
    donorCount: 45,
    title: 'New Campaign: Youth Programs 2024',
    description: 'Support our new initiatives to empower young people in our community.',
  },
};

export const WithoutDonorCount: Story = {
  args: {
    ...Default.args,
    donorCount: undefined,
  },
};

export const NoPercentage: Story = {
  args: {
    ...Default.args,
    showPercentage: false,
  },
};
