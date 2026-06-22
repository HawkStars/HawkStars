import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import InstagramEmbedWidget from './InstagramEmbedWidget';

// Note: InstagramEmbedWidget resolves a server-side data promise via React's
// `use()` and loads Instagram's embed.js script. In Storybook the data fetch
// resolves to no posts, so the widget renders its header + footer chrome only.
// This is expected.

const meta = {
  title: 'Socials/InstagramEmbedWidget',
  component: InstagramEmbedWidget,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
  argTypes: {
    maxPosts: { control: 'number' },
    showHeader: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div className='px-4 py-8'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InstagramEmbedWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    maxPosts: 3,
    showHeader: true,
  },
};

export const WithoutHeader: Story = {
  args: {
    maxPosts: 3,
    showHeader: false,
  },
};
