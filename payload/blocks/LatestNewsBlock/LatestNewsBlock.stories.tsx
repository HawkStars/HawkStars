import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LatestNewsBlockView } from './LatestNewsBlockView';

const meta: Meta<typeof LatestNewsBlockView> = {
  title: 'News & Events/Latest News',
  component: LatestNewsBlockView,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof LatestNewsBlockView>;

export const NewsArticle: Story = {
  args: {
    title: 'Latest News',
    subtitle: 'Stay up to date with what is happening at HawkStars',
    linkLabel: 'Read more',
    item: {
      heading: 'HawkStars Launches New Erasmus+ Youth Exchange Program',
      badge: 'Announcement',
      date: '2026-03-15T10:00:00.000Z',
      description: null,
      image: {
        url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop',
        alt: 'Youth exchange event',
      },
      href: '/news/erasmus-youth-exchange',
    },
  },
};

export const BlogPost: Story = {
  args: {
    title: 'From the Blog',
    subtitle: null,
    linkLabel: 'Continue reading',
    item: {
      heading: '5 Things We Learned from Our International Volunteers',
      badge: 'Blog',
      date: '2026-02-28T14:30:00.000Z',
      description: null,
      image: {
        url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop',
        alt: 'Volunteers collaborating',
      },
      href: '/news/5-things-volunteers',
    },
  },
};

export const HawkProjectEvent: Story = {
  args: {
    title: 'Latest Event',
    subtitle: 'Discover what HawkStars has been working on',
    linkLabel: 'Learn more',
    item: {
      heading: 'Global Village Festival 2026',
      badge: 'International Event',
      date: null,
      description:
        'A celebration of cultures bringing together youth from over 15 countries for a week of workshops, performances, and community building.',
      image: {
        url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop',
        alt: 'Festival event',
      },
      href: '/events/global-village-2026',
    },
  },
};

export const WithoutImage: Story = {
  args: {
    title: 'Latest Update',
    subtitle: null,
    linkLabel: 'Read more',
    item: {
      heading: 'Important Policy Update for All Members',
      badge: 'Press Release',
      date: '2026-01-10T09:00:00.000Z',
      description: null,
      image: null,
      href: '/news/policy-update',
    },
  },
};

export const MinimalNoHeader: Story = {
  args: {
    title: null,
    subtitle: null,
    linkLabel: 'Read more',
    item: {
      heading: 'Community Cleanup Day Recap',
      badge: 'News',
      date: '2026-03-01T08:00:00.000Z',
      description: null,
      image: {
        url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop',
        alt: 'Community cleanup',
      },
      href: '/news/cleanup-day',
    },
  },
};
