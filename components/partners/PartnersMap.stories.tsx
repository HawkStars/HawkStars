import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import PartnersMap from './PartnersMap';

const meta = {
  title: 'Pages/Partners/Partners Map',
  component: PartnersMap,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className='h-125 w-full'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PartnersMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
