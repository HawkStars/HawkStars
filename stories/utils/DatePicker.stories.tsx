import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import HawkStarsDatePicker from '@/components/utils/DatePicker/DatePicker';
import AppProvider from '@/utils/contexts/AppProvider';

const meta = {
  title: 'Design System/Date Picker',
  component: HawkStarsDatePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <AppProvider lng='en'>
        <Story />
      </AppProvider>
    ),
  ],
  // `onChange` is required by the component's props but the trigger button's
  // own state already drives what these stories render, so a no-op is enough.
  args: {
    onChange: () => {},
  },
} satisfies Meta<typeof HawkStarsDatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    labelText: 'Event date',
  },
};

export const WithDate: Story = {
  args: {
    labelText: 'Event date',
    date: new Date('2026-09-15'),
  },
};

export const WithoutLabel: Story = {
  args: {},
};
