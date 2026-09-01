import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { TFunction } from 'i18next';
import type { PaginatedDocs } from 'payload';
import ArchiveListComponent from './ArchiveListComponent';

type DemoItem = {
  id: string;
  title: string;
  date: string;
};

// A minimal stand-in for the "common" namespace TFunction the real archive
// pages fetch via getServerTranslation -- this component only ever calls it
// for the pagination.* keys used by <LandingPagination>.
const t = ((key: string, opts?: { page?: number; total?: number }) => {
  const strings: Record<string, string> = {
    'pagination.label': 'Pagination',
    'pagination.previous': 'Previous',
    'pagination.next': 'Next',
    'pagination.pageOf': `Page ${opts?.page} of ${opts?.total}`,
  };
  return strings[key] ?? key;
}) as TFunction<string, undefined>;

const paginate = (
  docs: DemoItem[],
  overrides: Partial<PaginatedDocs<DemoItem>> = {}
): PaginatedDocs<DemoItem> => ({
  docs,
  totalDocs: docs.length,
  limit: 10,
  totalPages: 1,
  page: 1,
  pagingCounter: 1,
  hasPrevPage: false,
  hasNextPage: false,
  prevPage: null,
  nextPage: null,
  ...overrides,
});

const renderCard = (item: DemoItem) => (
  <div
    key={item.id}
    className='border-bege-dark flex items-center justify-between rounded-lg border bg-white p-6 shadow-sm'
  >
    <h2 className='text-h3_semibold text-green'>{item.title}</h2>
    <span className='text-disabled text-sm'>{item.date}</span>
  </div>
);

const meta = {
  title: 'Pages/Shared/Archive List',
  component: ArchiveListComponent<DemoItem>,
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
} satisfies Meta<typeof ArchiveListComponent<DemoItem>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    lng: 'en',
    title: 'Past Events',
    emptyLabel: 'No past events yet.',
    renderCard,
    t,
    url: '/events/archive',
    items: paginate([
      { id: 'p1', title: 'Spring Volunteer Day', date: '10 Apr 2026' },
      { id: 'p2', title: 'Youth Workshop Series', date: '21 Feb 2026' },
    ]),
  },
};

export const Paginated: Story = {
  args: {
    lng: 'en',
    title: 'Past Events',
    emptyLabel: 'No past events yet.',
    renderCard,
    t,
    url: '/events/archive',
    items: paginate([{ id: 'p1', title: 'Spring Volunteer Day', date: '10 Apr 2026' }], {
      page: 2,
      totalPages: 5,
      hasPrevPage: true,
      hasNextPage: true,
    }),
  },
};

export const Empty: Story = {
  args: {
    lng: 'en',
    title: 'Past Events',
    emptyLabel: 'No past events yet.',
    renderCard,
    t,
    url: '/events/archive',
    items: paginate([]),
  },
};
