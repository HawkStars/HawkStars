import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import EventCard from './EventCard';

const baseEvent = {
  slug: 'festival-cultural-pinhel',
  heading: 'Festival Cultural de Pinhel',
  subheading: 'Cultura e comunidade',
  description:
    'Quatro dias de música, arte e gastronomia tradicional no coração de Pinhel, abertos a toda a comunidade.',
  date: '2026-07-12',
  endDate: '2026-07-15',
  isDateRange: true,
  image: {
    imageType: 'external',
    externalImage:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop',
    alt: 'Festival',
  },
};

const meta = {
  title: 'Events/EventCard',
  component: EventCard,
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EventCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    event: baseEvent,
    index: 0,
    lng: 'en',
  },
};

export const SingleDay: Story = {
  args: {
    event: {
      ...baseEvent,
      slug: 'workshop-robotica',
      heading: 'Workshop de Robótica',
      subheading: 'Programação para jovens',
      description: 'Introdução à robótica e programação para jovens dos 12 aos 18 anos.',
      endDate: null,
      isDateRange: false,
    },
    index: 1,
    lng: 'en',
  },
};

export const NoImage: Story = {
  args: {
    event: {
      ...baseEvent,
      slug: 'reuniao-geral',
      heading: 'Reunião Geral de Associados',
      subheading: null,
      description: 'Reunião anual para todos os associados da Associação HawkStars.',
      image: undefined,
    },
    index: 2,
    lng: 'en',
  },
};
