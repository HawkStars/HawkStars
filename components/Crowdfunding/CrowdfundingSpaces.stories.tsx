import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useTranslation } from '@/i18n/client';
import AppProvider from '@/utils/contexts/AppProvider';
import CrowdfundingSpaces from './CrowdfundingSpaces';

const SpacesWithT = () => {
  const { t } = useTranslation('en', 'crowdfunding');
  return <CrowdfundingSpaces t={t} />;
};

const meta = {
  title: 'Crowdfunding/Sections/Spaces',
  component: SpacesWithT,
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
} satisfies Meta<typeof SpacesWithT>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
