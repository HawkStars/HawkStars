import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useTranslation } from '@/i18n/client';
import AppProvider from '@/utils/contexts/AppProvider';
import CrowdfundingBusiness from './CrowdfundingBusiness';

const BusinessWithT = (props: Omit<React.ComponentProps<typeof CrowdfundingBusiness>, 't'>) => {
  const { t } = useTranslation('en', 'crowdfunding');
  return <CrowdfundingBusiness {...props} t={t} />;
};

const meta = {
  title: 'Crowdfunding/Sections/Business',
  component: BusinessWithT,
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
} satisfies Meta<typeof BusinessWithT>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    businessCtaUrl: 'https://hawkstars.org/partners',
  },
};

export const NoCtaUrl: Story = {
  args: {
    businessCtaUrl: null,
  },
};
