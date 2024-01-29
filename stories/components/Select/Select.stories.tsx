import type { Meta, StoryObj } from '@storybook/react';

import Select from '../../../components/utils/Select';

const meta: Meta<typeof Select> = {
  component: Select,
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Primary: Story = {
  args: {
    options: [
      { value: 'option1', label: 'Option 1', id: 'option1', disabled: true },
      { value: 'option2', label: 'Option 2', id: 'option2', disabled: false },
      { value: 'option3', label: 'Option 3', id: 'option3', disabled: false },
    ],
    defaultOption: { value: 'option1', label: 'Option 1', id: 'option1', disabled: true },
  },
};
