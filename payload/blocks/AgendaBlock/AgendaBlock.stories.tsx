import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AgendaBlockView } from './AgendaBlockView';

const meta: Meta<typeof AgendaBlockView> = {
  title: 'News & Events/AgendaBlock',
  component: AgendaBlockView,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    layout: {
      control: 'select',
      options: ['list', 'compact', 'cards'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof AgendaBlockView>;

// ─── Mock events ─────────────────────────────────────────────────────────────

const future = (daysAhead: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString();
};

const sampleEvents = [
  {
    id: '1',
    heading: 'Youth Exchange: Bridges of Culture',
    subheading: 'Erasmus+ KA1 — Porto, Portugal',
    description:
      'A 10-day intercultural exchange bringing together 40 young people from 8 European countries to explore cultural heritage, sustainability, and active citizenship.',
    badge: 'erasmus',
    image: {
      url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop',
      alt: 'Youth exchange',
    },
    href: '/events/bridges-of-culture',
    date: future(5),
    endDate: future(15),
    isDateRange: true,
  },
  {
    id: '2',
    heading: 'Community Art Workshop',
    subheading: 'Open to all ages',
    description:
      'An afternoon of collaborative mural painting in downtown Porto, led by local artists and HawkStars volunteers.',
    badge: 'local_event',
    image: {
      url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop',
      alt: 'Art workshop',
    },
    href: '/events/art-workshop',
    date: future(12),
    endDate: null,
    isDateRange: false,
  },
  {
    id: '3',
    heading: 'Global Village Festival 2025',
    subheading: 'Annual flagship event',
    description:
      'A week-long celebration of cultures featuring performances, food, workshops, and talks from participants representing over 15 countries.',
    badge: 'international_event',
    image: {
      url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop',
      alt: 'Festival',
    },
    href: '/events/global-village-2025',
    date: future(20),
    endDate: future(27),
    isDateRange: true,
  },
  {
    id: '4',
    heading: 'Volunteer Training Day',
    subheading: null,
    description: null,
    badge: 'other',
    image: null,
    href: '/events/volunteer-training',
    date: future(35),
    endDate: null,
    isDateRange: false,
  },
  {
    id: '5',
    heading: 'Leadership Summit',
    subheading: 'Young leaders from across Portugal',
    description:
      'A two-day residential summit for youth leaders aged 18–30 focused on strategy, impact measurement, and coalition building.',
    badge: 'local_event',
    image: {
      url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
      alt: 'Summit',
    },
    href: '/events/leadership-summit',
    date: future(42),
    endDate: future(43),
    isDateRange: true,
  },
];

// ─── Stories ─────────────────────────────────────────────────────────────────

export const ListLayout: Story = {
  name: 'List (default)',
  args: {
    title: 'Próximos Eventos',
    subtitle: 'Junta-te a nós nos nossos próximos projetos e atividades.',
    layout: 'list',
    linkLabel: 'Ver mais',
    events: sampleEvents,
  },
};

export const CompactLayout: Story = {
  name: 'Compact',
  args: {
    ...ListLayout.args,
    layout: 'compact',
  },
};

export const CardsLayout: Story = {
  name: 'Cards',
  args: {
    ...ListLayout.args,
    layout: 'cards',
  },
};

export const FilteredByType: Story = {
  name: 'Filtered — Erasmus Only',
  args: {
    ...ListLayout.args,
    title: 'Projetos Erasmus+',
    subtitle: 'Os nossos próximos intercâmbios e projetos financiados pela União Europeia.',
    events: sampleEvents.filter((e) => e.badge === 'erasmus'),
  },
};

export const SingleDateOnly: Story = {
  name: 'Single-day Events Only',
  args: {
    ...ListLayout.args,
    title: 'Eventos de Um Dia',
    events: sampleEvents.filter((e) => !e.isDateRange),
  },
};

export const LoadingState: Story = {
  name: 'Loading',
  args: {
    title: 'Próximos Eventos',
    layout: 'list',
    linkLabel: 'Ver mais',
    events: [],
    loading: true,
  },
};

export const EmptyState: Story = {
  name: 'Empty (No Events)',
  args: {
    title: 'Próximos Eventos',
    layout: 'list',
    linkLabel: 'Ver mais',
    events: [],
    loading: false,
  },
};

export const NoHeader: Story = {
  name: 'No Header',
  args: {
    layout: 'list',
    linkLabel: 'Saber mais',
    events: sampleEvents.slice(0, 3),
  },
};
