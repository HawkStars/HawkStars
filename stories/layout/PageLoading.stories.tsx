import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PageLoading } from '@/components/layout';

const meta = {
  title: 'Layout/Structure/Page Loading',
  component: PageLoading,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PageLoading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OnBegeBackground: Story = {
  decorators: [
    (Story) => (
      <div className='bg-bege-light'>
        <Story />
      </div>
    ),
  ],
};
