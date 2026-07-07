import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const meta = {
  title: 'Design System/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Email address',
  },
};

export const WithInput: Story = {
  render: () => (
    <div className='flex w-72 flex-col gap-2'>
      <Label htmlFor='email'>Email</Label>
      <Input id='email' type='email' placeholder='you@example.com' />
    </div>
  ),
};

export const WithCheckbox: Story = {
  render: () => (
    <div className='flex items-center gap-2'>
      <Checkbox id='newsletter' />
      <Label htmlFor='newsletter'>Subscribe to the newsletter</Label>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className='flex items-center gap-2'>
      <Checkbox id='disabled-field' disabled className='peer' />
      <Label htmlFor='disabled-field'>Disabled option</Label>
    </div>
  ),
};
