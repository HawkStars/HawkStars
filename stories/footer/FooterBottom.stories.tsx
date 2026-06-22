import FooterBottom from '@/components/footer/FooterBottom';
import AppProvider from '@/utils/contexts/AppProvider';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  title: 'Navigation/FooterBottom',
  component: FooterBottom,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
  args: {
    lng: 'en',
  },
  decorators: [
    (Story) => (
      <AppProvider lng='en'>
        <div className='bg-bege-light min-h-25 px-4 py-2'>
          <Story />
        </div>
      </AppProvider>
    ),
  ],
} satisfies Meta<typeof FooterBottom>;

export default meta;
type Story = StoryObj<typeof meta>;

export const English: Story = {
  args: {
    lng: 'en',
  },
};

export const Portuguese: Story = {
  args: {
    lng: 'pt',
  },
  decorators: [
    (Story) => (
      <AppProvider lng='pt'>
        <div className='bg-bege-light min-h-25 px-4 py-2'>
          <Story />
        </div>
      </AppProvider>
    ),
  ],
};
