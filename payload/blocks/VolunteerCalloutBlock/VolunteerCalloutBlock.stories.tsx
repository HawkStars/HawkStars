import type { Meta, StoryObj } from '@storybook/react';
import { VolunteerCalloutBlock } from './Component';

const meta: Meta<typeof VolunteerCalloutBlock> = {
  title: 'Payload Blocks/VolunteerCalloutBlock',
  component: VolunteerCalloutBlock,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof VolunteerCalloutBlock>;

export const Default: Story = {
  args: {
    title: 'Become a Volunteer',
    description:
      'Join our team of dedicated volunteers and help make a difference in the community',
    opportunities: [
      {
        role: 'Event Coordinator',
        description: 'Help organize and run community events and workshops',
        commitment: '10 hours/month',
        id: '1',
      },
      {
        role: 'Youth Mentor',
        description: 'Guide and support young people in their personal development',
        commitment: '5 hours/week',
        id: '2',
      },
      {
        role: 'Social Media Manager',
        description: 'Manage our social media presence and engage with our community online',
        commitment: '3 hours/week',
        id: '3',
      },
    ],
    ctaText: 'Apply Now',
    ctaLink: '#apply',
    id: '1',
    blockName: 'VolunteerCalloutBlock',
    blockType: 'volunteerCallout',
  },
};
