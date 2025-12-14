import type { Block } from 'payload';

export const MilestoneTrackerBlock: Block = {
  slug: 'milestoneTracker',
  interfaceName: 'MilestoneTrackerBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Building Progress',
    },
    {
      name: 'milestones',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Completed', value: 'completed' },
            { label: 'In Progress', value: 'in-progress' },
            { label: 'Upcoming', value: 'upcoming' },
          ],
          required: true,
        },
        {
          name: 'completedDate',
          type: 'date',
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },
  ],
  labels: {
    plural: 'Milestone Trackers',
    singular: 'Milestone Tracker',
  },
};
