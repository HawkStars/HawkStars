import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useTranslation } from '@/i18n/client';
import AppProvider from '@/utils/contexts/AppProvider';
import CrowdfundingCTA from './CrowdfundingCTA';

const CTAWithT = (props: Omit<React.ComponentProps<typeof CrowdfundingCTA>, 't'>) => {
  const { t } = useTranslation('en', 'crowdfunding');
  return <CrowdfundingCTA {...props} t={t} />;
};

const meta = {
  title: 'Crowdfunding/Sections/CTA',
  component: CTAWithT,
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
} satisfies Meta<typeof CTAWithT>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ctaImage: null,
    supportUrl: '#support',
    contactUrl: 'info@hawkstars.org',
  },
};

export const WithoutContact: Story = {
  args: {
    ...Default.args,
    contactUrl: null,
  },
};
