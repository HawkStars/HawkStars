import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const meta = {
  title: 'Design System/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: { type: 'boolean' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    'aria-label': 'Default checkbox',
  },
};

export const Checked: Story = {
  args: {
    defaultChecked: true,
    'aria-label': 'Checked checkbox',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    'aria-label': 'Disabled checkbox',
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
    'aria-label': 'Disabled checked checkbox',
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className='flex items-center gap-2'>
      <Checkbox id='terms' />
      <Label htmlFor='terms'>Accept terms and conditions</Label>
    </div>
  ),
};
