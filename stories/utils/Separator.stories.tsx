import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Separator } from '@/components/ui/separator';

const meta = {
  title: 'Design System/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: { type: 'inline-radio' },
      options: ['horizontal', 'vertical'],
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: (args) => (
    <div className='w-64'>
      <p className='text-sm'>Above the separator</p>
      <Separator {...args} className='my-4' />
      <p className='text-sm'>Below the separator</p>
    </div>
  ),
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  render: (args) => (
    <div className='flex h-8 items-center gap-4 text-sm'>
      <span>Home</span>
      <Separator {...args} />
      <span>About</span>
      <Separator {...args} />
      <span>Contact</span>
    </div>
  ),
};
