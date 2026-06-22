import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SplitListComponent from './SplitListComponent';

type DemoItem = {
  id: string;
  title: string;
  date: string;
};

const translations = {
  upcoming: 'Upcoming',
  past: 'Past',
  noUpcoming: 'No upcoming events yet.',
  noPast: 'No past events to show.',
  viewAgenda: 'View full agenda',
  viewAgendaDescription: 'Looking for a calendar view? Explore everything on our agenda.',
};

const renderCard = (item: DemoItem) => (
  <div
    key={item.id}
    className='border-bege-dark flex items-center justify-between rounded-lg border bg-white p-6 shadow-sm'
  >
    <h3 className='text-h3_semibold text-green'>{item.title}</h3>
    <span className='text-disabled text-sm'>{item.date}</span>
  </div>
);

const meta = {
  title: 'Misc/SplitListComponent',
  component: SplitListComponent<DemoItem>,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className='bg-bege-light'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SplitListComponent<DemoItem>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    lng: 'en',
    translations,
    renderCard,
    items: {
      upcoming: [
        { id: 'u1', title: 'Erasmus Mobility Kick-off', date: '15 Jul 2026' },
        { id: 'u2', title: 'Pinhel Cultural Festival', date: '02 Aug 2026' },
      ],
      past: [
        { id: 'p1', title: 'Spring Volunteer Day', date: '10 Apr 2026' },
        { id: 'p2', title: 'Youth Workshop Series', date: '21 Feb 2026' },
      ],
    },
  },
};

export const NoUpcoming: Story = {
  args: {
    lng: 'en',
    translations,
    renderCard,
    items: {
      upcoming: [],
      past: [{ id: 'p1', title: 'Spring Volunteer Day', date: '10 Apr 2026' }],
    },
  },
};

export const Empty: Story = {
  args: {
    lng: 'en',
    translations,
    renderCard,
    items: {
      upcoming: [],
      past: [],
    },
  },
};
