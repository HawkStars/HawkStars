import type { Meta, StoryObj } from '@storybook/react';
import { ImpactBlock } from './Component';

const meta: Meta<typeof ImpactBlock> = {
  title: 'Cards/ImpactBlock',
  component: ImpactBlock,
  parameters: {
    layout: 'fullscreen',
  },

  argTypes: {
    layout: {
      control: 'select',
      options: ['grid-2', 'grid-3', 'grid-4', 'row'],
    },
    background: {
      control: 'select',
      options: ['none', 'light-gray', 'dark', 'gradient'],
    },
    textAlign: {
      control: 'select',
      options: ['left', 'center', 'right'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ImpactBlock>;

export const Default: Story = {
  args: {
    title: 'Our Impact',
    subtitle: 'Making a difference in the community',
    metrics: [
      {
        label: 'People Helped',
        value: 10000,
        suffix: '+',
        icon: 'Users',
        color: 'blue',
        animateOnScroll: true,
        id: '1',
      },
      {
        label: 'Projects Completed',
        value: 500,
        suffix: '+',
        icon: 'Target',
        color: 'green',
        animateOnScroll: true,
        id: '2',
      },
      {
        label: 'Volunteer Hours',
        value: 25000,
        suffix: '',
        icon: 'Heart',
        color: 'red',
        animateOnScroll: true,
        id: '3',
      },
    ],
    layout: 'grid-3',
    background: 'none',
    textAlign: 'center',
    id: '1',
    blockName: 'ImpactBlock',
    blockType: 'impactBlock',
  },
};

export const WithPrefix: Story = {
  args: {
    title: 'Financial Impact',
    metrics: [
      {
        label: 'Funds Raised',
        value: 1000000,
        prefix: '€',
        icon: 'Target',
        color: 'green',
        animateOnScroll: true,
        id: '1',
      },
      {
        label: 'Budget Allocated',
        value: 750000,
        prefix: '€',
        icon: 'Heart',
        color: 'blue',
        animateOnScroll: true,
        id: '2',
      },
    ],
    layout: 'grid-2',
    background: 'light-gray',
    textAlign: 'center',
    id: '2',
    blockName: 'ImpactBlock',
    blockType: 'impactBlock',
  },
};

export const FourColumns: Story = {
  args: {
    title: 'Platform Statistics',
    metrics: [
      {
        label: 'Active Users',
        value: 50000,
        suffix: '+',
        color: 'purple',
        animateOnScroll: true,
        id: '1',
      },
      {
        label: 'Downloads',
        value: 100000,
        suffix: '+',
        color: 'blue',
        animateOnScroll: true,
        id: '2',
      },
      {
        label: 'Rating',
        value: 4.9,
        suffix: '/5',
        color: 'yellow',
        animateOnScroll: true,
        id: '3',
      },
      {
        label: 'Countries',
        value: 120,
        suffix: '+',
        color: 'green',
        animateOnScroll: true,
        id: '4',
      },
    ],
    layout: 'grid-4',
    background: 'gradient',
    textAlign: 'center',
    id: '3',
    blockName: 'ImpactBlock',
    blockType: 'impactBlock',
  },
};

export const RowLayout: Story = {
  args: {
    title: 'Key Metrics',
    metrics: [
      {
        label: 'Uptime',
        value: 99.9,
        suffix: '%',
        color: 'green',
        animateOnScroll: true,
        id: '1',
      },
      {
        label: 'Response Time',
        value: 50,
        suffix: 'ms',
        color: 'blue',
        animateOnScroll: true,
        id: '2',
      },
      {
        label: 'Satisfaction',
        value: 98,
        suffix: '%',
        color: 'yellow',
        animateOnScroll: true,
        id: '3',
      },
    ],
    layout: 'row',
    background: 'dark',
    textAlign: 'center',
    id: '4',
    blockName: 'ImpactBlock',
    blockType: 'impactBlock',
  },
};
