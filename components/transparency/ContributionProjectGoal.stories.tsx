import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AppProvider from '@/utils/contexts/AppProvider';
import ContributionProjectGoal from './ContributionProjectGoal';
import { makeTotals, SAMPLE_TOTALS } from './storyData';

const meta = {
  title: 'Pages/Transparency/Contribution Project Goal',
  component: ContributionProjectGoal,
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
} satisfies Meta<typeof ContributionProjectGoal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { totals: SAMPLE_TOTALS },
};

export const Empty: Story = {
  args: { totals: makeTotals({}) },
};

export const NearGoal: Story = {
  args: {
    totals: makeTotals({ BANK: 500000, WALL_NAME_COMPANY: 150000, BUILDING_NAMING: 200000 }),
  },
};
