import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useTranslation } from '@/i18n/client';
import AppProvider from '@/utils/contexts/AppProvider';
import CrowdfundingHero from './CrowdfundingHero';

// Wrapper that supplies a real `t` via the crowdfunding namespace so the
// component renders translated copy inside Storybook.
const HeroWithT = (props: Omit<React.ComponentProps<typeof CrowdfundingHero>, 't'>) => {
  const { t } = useTranslation(props.lng, 'crowdfunding');
  return <CrowdfundingHero {...props} t={t} />;
};

const meta = {
  title: 'Crowdfunding/CrowdfundingHero',
  component: HeroWithT,
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
} satisfies Meta<typeof HeroWithT>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    lng: 'en',
    raisedAmount: 42500,
    campaignGoal: 100000,
    projectGoal: 250000,
    heroImage: null,
    lastUpdateDate: 'March 2025',
    supportUrl: '#support',
  },
};

export const NearGoal: Story = {
  args: {
    ...Default.args,
    raisedAmount: 96000,
    campaignGoal: 100000,
  },
};

export const JustStarted: Story = {
  args: {
    ...Default.args,
    raisedAmount: 1200,
    campaignGoal: 100000,
  },
};

export const Portuguese: Story = {
  args: {
    ...Default.args,
    lng: 'pt',
    lastUpdateDate: 'Março 2025',
  },
  decorators: [
    (Story) => (
      <AppProvider lng='pt'>
        <Story />
      </AppProvider>
    ),
  ],
};
