import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import HorizontalLine from '@/components/ui/horizontal-line';

const meta = {
  title: 'Design System/Horizontal Line',
  component: HorizontalLine,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof HorizontalLine>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const BetweenSections: Story = {
  render: () => (
    <div>
      <p className='px-8 lg:px-20'>Section above the divider.</p>
      <HorizontalLine />
      <p className='px-8 lg:px-20'>Section below the divider.</p>
    </div>
  ),
};
