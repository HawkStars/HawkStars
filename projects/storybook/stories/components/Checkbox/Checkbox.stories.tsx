import Checkbox from '@/components/utils/Checkbox/Checkbox';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Checkbox> = {
  component: Checkbox,
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Primary: Story = {
  args: {
    labelText: 'Checkbox',
  },
};
