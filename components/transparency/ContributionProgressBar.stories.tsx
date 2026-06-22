import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ContributionProgressBar from './ContributionProgressBar';

const meta = {
  title: 'Transparency/ContributionProgressBar',
  component: ContributionProgressBar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    sumContributions: { control: 'number' },
    projectGoal: { control: 'number' },
  },
  decorators: [
    (Story) => (
      <div className='bg-bege-light px-8 py-12'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ContributionProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sumContributions: 250000,
    projectGoal: 900000,
  },
};

export const Empty: Story = {
  args: {
    sumContributions: 0,
    projectGoal: 900000,
  },
};

export const HalfwayThere: Story = {
  args: {
    sumContributions: 450000,
    projectGoal: 900000,
  },
};

export const GoalReached: Story = {
  args: {
    sumContributions: 900000,
    projectGoal: 900000,
  },
};

export const SmallGoal: Story = {
  args: {
    sumContributions: 750,
    projectGoal: 1000,
  },
};
