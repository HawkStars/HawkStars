import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AppProvider from '@/utils/contexts/AppProvider';
import InstagramGrid from './InstagramGrid';

// Note: InstagramGrid fetches live data from `/api/instagram` via useEffect.
// In Storybook that request will fail, so the component renders its skeleton
// loading state and then the empty/error fallback. This is expected.

const meta = {
  title: 'Socials/InstagramGrid',
  component: InstagramGrid,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
  argTypes: {
    maxPosts: { control: 'number' },
    columns: { control: 'select', options: [3, 4] },
    showOverlay: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <AppProvider lng='en'>
        <div className='px-4 py-8'>
          <Story />
        </div>
      </AppProvider>
    ),
  ],
} satisfies Meta<typeof InstagramGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    maxPosts: 9,
    columns: 3,
    showOverlay: true,
  },
};

export const FourColumns: Story = {
  args: {
    maxPosts: 8,
    columns: 4,
    showOverlay: true,
  },
};

export const WithoutOverlay: Story = {
  args: {
    maxPosts: 6,
    columns: 3,
    showOverlay: false,
  },
};
