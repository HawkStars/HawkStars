import type { Meta, StoryObj } from '@storybook/react';
import { StatsBlock } from './Component';

const meta: Meta<typeof StatsBlock> = {
  title: 'Payload Blocks/StatsBlock',
  component: StatsBlock,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof StatsBlock>;

export const Default: Story = {
  args: {
    heading: "We don't just talk we Deliver Results",
    description: 'Our proven track record speaks for itself',
    ctaButtonText: 'Get Started With Us',
    primaryStat: {
      monthlyValue: 10,
      yearlyValue: 120,
      prefix: '$',
      suffix: 'M',
    },
    secondaryText: 'And its just in a year',
    toggleButtonText: 'Show Monthly Stats',
    stats: [
      {
        monthlyValue: 50,
        yearlyValue: 600,
        suffix: 'k+',
        label: 'Active Users',
        id: '1',
      },
      {
        monthlyValue: 98,
        yearlyValue: 99,
        suffix: '%',
        label: 'Customer Satisfaction',
        id: '2',
      },
      {
        monthlyValue: 25,
        yearlyValue: 300,
        suffix: '+',
        prefix: '~',
        label: 'Team Members',
        id: '3',
      },
      {
        monthlyValue: 15,
        yearlyValue: 180,
        suffix: '%',
        label: 'Company Growth',
        id: '4',
      },
    ],
    id: '1',
    blockName: 'StatsBlock',
    blockType: 'statsBlock',
  },
};

export const MinimalStats: Story = {
  args: {
    heading: 'Our Impact',
    primaryStat: {
      monthlyValue: 1,
      yearlyValue: 12,
      prefix: '$',
      suffix: 'M',
    },
    stats: [
      {
        monthlyValue: 1000,
        yearlyValue: 12000,
        suffix: '+',
        label: 'Projects Completed',
        id: '1',
      },
      {
        monthlyValue: 50,
        yearlyValue: 600,
        suffix: '',
        label: 'Countries Served',
        id: '2',
      },
    ],
    id: '2',
    blockName: 'StatsBlock',
    blockType: 'statsBlock',
  },
};
