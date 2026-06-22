import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { CrowdfundingSetting } from '@/payload-types';
import { useTranslation } from '@/i18n/client';
import AppProvider from '@/utils/contexts/AppProvider';
import CrowdfundingTransparency from './CrowdfundingTransparency';

const phases: CrowdfundingSetting['phases'] = [
  {
    id: '1',
    title: 'Phase 1: Fundraising',
    description: 'March 2024 - December 2024',
    completed: true,
  },
  {
    id: '2',
    title: 'Phase 2: Construction',
    description: 'January 2025 - June 2025',
    completed: false,
  },
  {
    id: '3',
    title: 'Phase 3: Opening',
    description: 'July 2025',
    completed: false,
  },
];

const TransparencyWithT = (
  props: Omit<React.ComponentProps<typeof CrowdfundingTransparency>, 't'>
) => {
  const { t } = useTranslation(props.lng, 'crowdfunding');
  return <CrowdfundingTransparency {...props} t={t} />;
};

const meta = {
  title: 'Crowdfunding/CrowdfundingTransparency',
  component: TransparencyWithT,
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
} satisfies Meta<typeof TransparencyWithT>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    lng: 'en',
    raisedAmount: 42500,
    campaignGoal: 100000,
    projectGoal: 250000,
    weeklyIncrease: '+2.3% this week',
    lastUpdateDate: 'March 2025',
    phases,
    transparencyDocUrl: 'https://hawkstars.org/transparency.pdf',
  },
};

export const NoDocument: Story = {
  args: {
    ...Default.args,
    transparencyDocUrl: null,
  },
};

export const NoPhases: Story = {
  args: {
    ...Default.args,
    phases: [],
  },
};
