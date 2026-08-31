import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const meta = {
  title: 'Design System/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'file'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
  render: (args) => <Input {...args} className='w-72' />,
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'you@example.com',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Password',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled',
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: 'HawkStars',
    'aria-label': 'Site name',
  },
};

export const File: Story = {
  args: {
    type: 'file',
    'aria-label': 'Upload file',
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className='flex w-72 flex-col gap-2'>
      <Label htmlFor='name'>Name</Label>
      <Input id='name' placeholder='Your name' />
    </div>
  ),
};
