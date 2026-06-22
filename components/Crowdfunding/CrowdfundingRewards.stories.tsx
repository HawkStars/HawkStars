import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { CrowdfundingSetting } from '@/payload-types';
import { useTranslation } from '@/i18n/client';
import AppProvider from '@/utils/contexts/AppProvider';
import CrowdfundingRewards from './CrowdfundingRewards';

const rewardTiers: CrowdfundingSetting['rewardTiers'] = [
  {
    id: '1',
    title: 'Friend',
    subtitle: 'From €10',
    icon: 'heart',
    items: [
      { id: 'a', price: '€10', label: 'Thank you card' },
      { id: 'b', price: '€25', label: 'Name on the wall' },
    ],
  },
  {
    id: '2',
    title: 'Partner',
    subtitle: 'From €100',
    icon: 'building',
    items: [
      { id: 'c', price: '€100', label: 'Logo on the website' },
      { id: 'd', price: '€250', label: 'Sponsored office chair' },
    ],
  },
  {
    id: '3',
    title: 'Patron',
    subtitle: 'From €500',
    icon: 'location',
    items: [{ id: 'e', price: '€500', label: 'Named training room' }],
  },
  {
    id: '4',
    title: 'Champion',
    subtitle: 'From €1000',
    icon: 'trophy',
    items: [{ id: 'f', price: '€1000', label: 'Building naming rights' }],
  },
] as CrowdfundingSetting['rewardTiers'];

const RewardsWithT = (props: Omit<React.ComponentProps<typeof CrowdfundingRewards>, 't'>) => {
  const { t } = useTranslation('en', 'crowdfunding');
  return <CrowdfundingRewards {...props} t={t} />;
};

const meta = {
  title: 'Crowdfunding/CrowdfundingRewards',
  component: RewardsWithT,
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
} satisfies Meta<typeof RewardsWithT>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    supportUrl: '#support',
    rewardTiers,
  },
};

export const NoTiers: Story = {
  args: {
    supportUrl: '#support',
    rewardTiers: [] as CrowdfundingSetting['rewardTiers'],
  },
};
