import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { UpcomingHawkEventBlockView } from './UpcomingHawkEventBlockView';

const meta: Meta<typeof UpcomingHawkEventBlockView> = {
  title: 'News & Events/Upcoming Hawk Event',
  component: UpcomingHawkEventBlockView,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof UpcomingHawkEventBlockView>;

export const ErasmusProject: Story = {
  args: {
    title: 'Upcoming Event',
    subtitle: 'Join us in our next adventure',
    linkLabel: 'Learn more',
    event: {
      heading: 'Youth Exchange: Bridges of Culture',
      subheading: 'Erasmus+ KA1 Youth Exchange in Porto, Portugal',
      description:
        'A 10-day intercultural exchange bringing together 40 young people from 8 European countries to explore cultural heritage, sustainability, and active citizenship through non-formal education.',
      badge: 'Erasmus +',
      image: {
        url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop',
        alt: 'Youth exchange participants',
      },
      href: '/events/bridges-of-culture',
    },
  },
};

export const LocalEvent: Story = {
  args: {
    title: 'Next Up',
    subtitle: null,
    linkLabel: 'See details',
    event: {
      heading: 'Community Art Workshop',
      subheading: 'Open to all ages',
      description:
        'An afternoon of collaborative mural painting in downtown Porto, led by local artists and HawkStars volunteers.',
      badge: 'Local Event',
      image: {
        url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop',
        alt: 'Art workshop',
      },
      href: '/events/art-workshop',
    },
  },
};

export const InternationalEvent: Story = {
  args: {
    title: 'Upcoming Event',
    subtitle: 'Connecting communities across borders',
    linkLabel: 'Learn more',
    event: {
      heading: 'Global Village Festival 2026',
      subheading: 'Annual flagship event',
      description:
        'A week-long celebration of cultures featuring performances, food, workshops, and talks from participants representing over 15 countries.',
      badge: 'International Event',
      image: {
        url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop',
        alt: 'Festival event',
      },
      href: '/events/global-village-2026',
    },
  },
};

export const MinimalNoImage: Story = {
  args: {
    title: 'Coming Soon',
    subtitle: null,
    linkLabel: 'Learn more',
    event: {
      heading: 'Volunteer Training Day',
      subheading: null,
      description: null,
      badge: 'Other',
      image: null,
      href: '/events/volunteer-training',
    },
  },
};

export const NoHeader: Story = {
  args: {
    title: null,
    subtitle: null,
    linkLabel: 'Discover',
    event: {
      heading: 'Summer Camp: Green Futures',
      subheading: 'Environmental awareness for young leaders',
      description:
        'A 5-day outdoor camp focused on sustainability, teamwork, and environmental stewardship for youth aged 16-25.',
      badge: 'Local Event',
      image: {
        url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop',
        alt: 'Summer camp',
      },
      href: '/events/green-futures',
    },
  },
};
