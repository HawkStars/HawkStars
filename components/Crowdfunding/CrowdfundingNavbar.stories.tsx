import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AppProvider from '@/utils/contexts/AppProvider';
import CrowdfundingNavbar from './CrowdfundingNavbar';

// CrowdfundingNavbar reads the language from AppProvider and resolves its own
// translations via useTranslation, so no props are required.
const meta = {
  title: 'Crowdfunding/CrowdfundingNavbar',
  component: CrowdfundingNavbar,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <AppProvider lng='en'>
        <div className='bg-crowdfunding-bg min-h-100'>
          <Story />
        </div>
      </AppProvider>
    ),
  ],
} satisfies Meta<typeof CrowdfundingNavbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Portuguese: Story = {
  decorators: [
    (Story) => (
      <AppProvider lng='pt'>
        <div className='bg-crowdfunding-bg min-h-100'>
          <Story />
        </div>
      </AppProvider>
    ),
  ],
};
