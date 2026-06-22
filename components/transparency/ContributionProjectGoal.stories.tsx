import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AppProvider from '@/utils/contexts/AppProvider';
import ContributionProjectGoal from './ContributionProjectGoal';

const meta = {
  title: 'Transparency/ContributionProjectGoal',
  component: ContributionProjectGoal,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    sumContributions: { control: 'number' },
  },
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
  args: {
    sumContributions: 250000,
  },
};

export const Empty: Story = {
  args: {
    sumContributions: 0,
  },
};

export const NearGoal: Story = {
  args: {
    sumContributions: 850000,
  },
};
