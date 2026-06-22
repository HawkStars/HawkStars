import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { VideoEmbed } from './VideoEmbed';

const meta = {
  title: 'Crowdfunding/VideoEmbed',
  component: VideoEmbed,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className='bg-crowdfunding-bg mx-auto max-w-3xl p-6'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof VideoEmbed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const YouTube: Story = {
  args: {
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: '/images/projects/2.jpeg',
    overlayLine1: 'Watch our story',
    overlayLine2: 'Global Village',
  },
};

export const Vimeo: Story = {
  args: {
    ...YouTube.args,
    videoUrl: 'https://vimeo.com/76979871',
  },
};
