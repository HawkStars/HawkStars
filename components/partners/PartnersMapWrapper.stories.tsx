import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import PartnersMapWrapper from './PartnersMapWrapper';

const meta = {
  title: 'Partners/PartnersMapWrapper',
  component: PartnersMapWrapper,
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
} satisfies Meta<typeof PartnersMapWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
