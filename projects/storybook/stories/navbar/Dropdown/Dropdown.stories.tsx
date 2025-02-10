import Dropdown from '@/components/utils/Dropdown';
import type { Meta, StoryObj } from '@storybook/react';



const meta: Meta<typeof Dropdown> = {
  component: Dropdown,
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Primary: Story = {
  args: {
    title: 'Dropdown',
    options: [
      { label: 'Option 1', url: 'option1', disabled: false, soon: false },
      { label: 'Option 2', url: 'option2', disabled: false, soon: false },
    ],
  },
};
