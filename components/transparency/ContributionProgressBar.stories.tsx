import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ContributionProgressBar from './ContributionProgressBar';
import { PROJECT_GOAL } from './config';
import { makeTotals, SAMPLE_TOTALS } from './storyData';

const toSegments = (totals: typeof SAMPLE_TOTALS) =>
  totals.map(({ type, sum }) => ({ type, value: sum, label: type }));

const meta = {
  title: 'Pages/Transparency/Contribution Progress Bar',
  component: ContributionProgressBar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
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
    segments: toSegments(SAMPLE_TOTALS),
    projectGoal: PROJECT_GOAL,
    label: '26% of the goal raised',
  },
};

export const Empty: Story = {
  args: {
    segments: toSegments(makeTotals({})),
    projectGoal: PROJECT_GOAL,
    label: '0% of the goal raised',
  },
};

export const SingleType: Story = {
  args: {
    segments: toSegments(makeTotals({ BANK: 450000 })),
    projectGoal: PROJECT_GOAL,
    label: '50% of the goal raised',
  },
};

export const GoalReached: Story = {
  args: {
    segments: toSegments(
      makeTotals({
        BANK: 400000,
        WALL_NAME_COMPANY: 200000,
        OFFICE_CHAIR: 150000,
        BUILDING_NAMING: 150000,
      })
    ),
    projectGoal: PROJECT_GOAL,
    label: '100% of the goal raised',
  },
};
