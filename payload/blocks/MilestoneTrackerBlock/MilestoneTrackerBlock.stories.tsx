import type { Meta, StoryObj } from '@storybook/react';
import { MilestoneTrackerBlock } from './Component';

const meta: Meta<typeof MilestoneTrackerBlock> = {
  title: 'Payload Blocks/MilestoneTrackerBlock',
  component: MilestoneTrackerBlock,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof MilestoneTrackerBlock>;

export const Default: Story = {
  args: {
    title: 'Building Progress',
    milestones: [
      {
        title: 'Fundraising Campaign Launch',
        status: 'completed',
        completedDate: '2023-01-15',
        description: 'Successfully launched our fundraising campaign with community partners.',
        id: '1',
      },
      {
        title: 'Land Acquisition',
        status: 'completed',
        completedDate: '2023-06-20',
        description: 'Secured the perfect location for our community center.',
        id: '2',
      },
      {
        title: 'Architectural Design',
        status: 'in-progress',
        description: 'Working with architects to finalize the building design.',
        id: '3',
      },
      {
        title: 'Construction Permits',
        status: 'upcoming',
        description: 'Applying for all necessary building permits and approvals.',
        id: '4',
      },
      {
        title: 'Ground Breaking',
        status: 'upcoming',
        description: 'Official ground breaking ceremony.',
        id: '5',
      },
    ],
    id: '1',
    blockName: 'MilestoneTrackerBlock',
    blockType: 'milestoneTracker',
  },
};
