import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import SectionList from '@/components/ui/SectionList';

const meta = {
  title: 'Design System/Section List',
  component: SectionList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    ordered: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof SectionList>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  { label: 'Cultural events', description: 'Organising local festivals and gatherings.' },
  { label: 'Humanitarian aid', description: 'Supporting families in need across Pinhel.' },
  { label: 'Volunteer programs', description: 'Coordinating community volunteers.' },
];

export const Default: Story = {
  args: {
    items,
    className: 'w-96',
  },
};

export const Ordered: Story = {
  args: {
    items,
    ordered: true,
    className: 'w-96',
  },
};

export const LabelsOnly: Story = {
  args: {
    items: [{ label: 'First item' }, { label: 'Second item' }, { label: 'Third item' }],
    className: 'w-96',
  },
};
