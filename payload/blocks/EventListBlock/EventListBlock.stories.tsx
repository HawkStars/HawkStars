import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { EventListBlock } from './Component';

const meta: Meta<typeof EventListBlock> = {
  title: 'Extra/EventListBlock',
  component: EventListBlock,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    layout: {
      control: 'select',
      options: ['list', 'grid', 'timeline'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof EventListBlock>;

const futureDate1 = new Date();
futureDate1.setDate(futureDate1.getDate() + 5);

const futureDate2 = new Date();
futureDate2.setDate(futureDate2.getDate() + 12);

const futureDate3 = new Date();
futureDate3.setDate(futureDate3.getDate() + 20);

const sampleEvents = [
  {
    title: 'Youth Leadership Workshop',
    description:
      'An interactive workshop focused on developing leadership skills for young people aged 16-25.',
    date: futureDate1.toISOString(),
    location: 'Community Center, Lisbon',
    category: 'workshop' as const,
    registrationLink: '#register',
    isFeatured: true,
    maxParticipants: 30,
    spotsRemaining: 12,
    id: '1',
  },
  {
    title: 'Community Fundraising Gala',
    description:
      'Join us for an evening of celebration and fundraising to support our new building project.',
    date: futureDate2.toISOString(),
    location: 'Grand Hall, Porto',
    category: 'fundraiser' as const,
    registrationLink: '#gala',
    isFeatured: false,
    maxParticipants: 200,
    spotsRemaining: 45,
    id: '2',
  },
  {
    title: 'Monthly Member Meeting',
    description: 'Regular meeting for all members to discuss upcoming projects and initiatives.',
    date: futureDate3.toISOString(),
    location: 'Online - Zoom',
    category: 'meeting' as const,
    registrationLink: '#meeting',
    isFeatured: false,
    id: '3',
  },
];

export const ListView: Story = {
  args: {
    title: 'Upcoming Events',
    subtitle: 'Join us for these exciting community events and programs',
    events: sampleEvents,
    layout: 'list',
    showPastEvents: false,
    id: '1',
    blockName: 'EventListBlock',
    blockType: 'eventList',
  },
};

export const GridView: Story = {
  args: {
    ...ListView.args,
    layout: 'grid',
  },
};

export const TimelineView: Story = {
  args: {
    ...ListView.args,
    layout: 'timeline',
  },
};

export const WithImages: Story = {
  args: {
    ...ListView.args,
    events: sampleEvents.map((event) => ({
      ...event,
      image: {
        externalImage: `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop`,
      },
    })),
  },
};
