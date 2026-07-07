import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { PaginatedDocs } from 'payload';
import type { Contribution } from '@/payload-types';
import OrganizationContributionsTable from './OrganizationContributionsTable';

// Note: this is an async server component that also reads `window.location`
// for pagination links. It may not fully render inside Storybook's client
// renderer, but the mock data documents the expected prop shape.

const contributions: Contribution[] = [
  {
    id: '1',
    donor: 'Maria Silva',
    is_anonymous: false,
    value: 5000,
    contribution_date: '2026-01-15T00:00:00.000Z',
    contribution_type: 'BANK',
    updatedAt: '2026-01-15T00:00:00.000Z',
    createdAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: '2',
    donor: 'Acme Lda.',
    is_anonymous: false,
    value: 25000,
    contribution_date: '2026-02-03T00:00:00.000Z',
    contribution_type: 'WALL_NAME_COMPANY',
    updatedAt: '2026-02-03T00:00:00.000Z',
    createdAt: '2026-02-03T00:00:00.000Z',
  },
  {
    id: '3',
    donor: null,
    is_anonymous: true,
    value: 1500,
    contribution_date: '2026-03-21T00:00:00.000Z',
    contribution_type: 'CRYPTO',
    updatedAt: '2026-03-21T00:00:00.000Z',
    createdAt: '2026-03-21T00:00:00.000Z',
  },
  {
    id: '4',
    donor: 'João Costa',
    is_anonymous: false,
    value: 800,
    contribution_date: '2026-04-10T00:00:00.000Z',
    contribution_type: 'OFFICE_CHAIR',
    updatedAt: '2026-04-10T00:00:00.000Z',
    createdAt: '2026-04-10T00:00:00.000Z',
  },
] as unknown as Contribution[];

const buildData = (docs: Contribution[]): PaginatedDocs<Contribution> =>
  ({
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
  }) as unknown as PaginatedDocs<Contribution>;

const meta = {
  title: 'Pages/Transparency/Organization Contributions Table',
  component: OrganizationContributionsTable,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof OrganizationContributionsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    lng: 'en',
    data: buildData(contributions),
  },
};

export const Empty: Story = {
  args: {
    lng: 'en',
    data: buildData([]),
  },
};
