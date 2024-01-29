import type { Meta, StoryObj } from '@storybook/react';

import DatePicker from '../../../components/utils/DatePicker/DatePicker';

const meta: Meta<typeof DatePicker> = {
  component: DatePicker,
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Primary: Story = {
  args: {
    labelText: 'Testing Date Picker',
    date: new Date(),
  },
};
