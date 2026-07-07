import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useTranslation } from '@/i18n/client';
import AppProvider from '@/utils/contexts/AppProvider';
import CrowdfundingFAQ from './CrowdfundingFAQ';

const FAQWithT = () => {
  const { t } = useTranslation('en', 'crowdfunding');
  return <CrowdfundingFAQ t={t} />;
};

const meta = {
  title: 'Crowdfunding/Sections/FAQ',
  component: FAQWithT,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <AppProvider lng='en'>
        <Story />
      </AppProvider>
    ),
  ],
} satisfies Meta<typeof FAQWithT>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
