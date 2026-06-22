import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ShareButton } from './ShareButton';

const meta = {
  title: 'Crowdfunding/ShareButton',
  component: ShareButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className='bg-crowdfunding-bg p-10'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ShareButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Share',
  },
};
