import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src='https://github.com/shadcn.png' alt='User avatar' />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

export const Fallback: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src='https://invalid-url.example/missing.png' alt='Missing avatar' />
      <AvatarFallback>HS</AvatarFallback>
    </Avatar>
  ),
};

export const Large: Story = {
  render: (args) => (
    <Avatar {...args} className='size-16'>
      <AvatarImage src='https://github.com/shadcn.png' alt='User avatar' />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

export const Group: Story = {
  render: () => (
    <div className='flex -space-x-3'>
      {['AB', 'CD', 'EF', 'GH'].map((initials) => (
        <Avatar key={initials} className='ring-background size-10 ring-2'>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
};
