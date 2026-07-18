import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PaginatedDocs } from 'payload';
import { HawkProject } from '@/payload-types';
import EventsList from './index';

const makeProject = (id: string, heading: string, text: string, imageUrl: string): HawkProject =>
  ({
    id,
    heading,
    slug: heading.toLowerCase().replace(/\s+/g, '-'),
    coverImage: {
      imageType: 'external',
      externalImage: imageUrl,
      alt: heading,
    },
    details: { text },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  }) as unknown as HawkProject;

const sampleDocs: HawkProject[] = [
  makeProject(
    '1',
    'AI4YOU(th)',
    'Mobilidade de jovens em torno da inteligência artificial.',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=600&fit=crop'
  ),
  makeProject(
    '2',
    'Green Roots',
    'Projeto de sustentabilidade ambiental e reflorestação.',
    'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200&h=600&fit=crop'
  ),
  makeProject(
    '3',
    'Culture Bridges',
    'Intercâmbio cultural entre jovens europeus.',
    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&h=600&fit=crop'
  ),
];

const makePaginated = (docs: HawkProject[]): PaginatedDocs<HawkProject> =>
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
  }) as unknown as PaginatedDocs<HawkProject>;

const meta = {
  title: 'Pages/Events/Events List',
  component: EventsList,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EventsList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    events: makePaginated(sampleDocs),
  },
};

export const SingleEvent: Story = {
  args: {
    events: makePaginated(sampleDocs.slice(0, 1)),
  },
};

export const Empty: Story = {
  args: {
    events: makePaginated([]),
  },
};
