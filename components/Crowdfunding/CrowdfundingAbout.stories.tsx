import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useTranslation } from '@/i18n/client';
import AppProvider from '@/utils/contexts/AppProvider';
import CrowdfundingAbout from './CrowdfundingAbout';

const AboutWithT = () => {
  const { t } = useTranslation('en', 'crowdfunding');
  return <CrowdfundingAbout t={t} />;
};

const meta = {
  title: 'Crowdfunding/Sections/About',
  component: AboutWithT,
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
} satisfies Meta<typeof AboutWithT>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
