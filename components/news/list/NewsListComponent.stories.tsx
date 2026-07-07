import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PaginatedDocs } from 'payload';
import { News } from '@/payload-types';
import NewsListComponent from './NewsListComponent';

const makeArticle = (
  id: string,
  title: string,
  type: News['type'],
  imageUrl: string | null,
  publishedAt: string
): News =>
  ({
    id,
    title,
    type,
    slug: title.toLowerCase().replace(/\s+/g, '-'),
    status: 'published',
    publishedAt,
    mainImage: imageUrl
      ? { imageType: 'external', externalImage: imageUrl, alt: title }
      : undefined,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  }) as unknown as News;

const articles: News[] = [
  makeArticle(
    '1',
    'HawkStars lança novo projeto Erasmus+',
    'news',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop',
    '2026-04-10'
  ),
  makeArticle(
    '2',
    'Reflexões sobre o nosso primeiro ano',
    'blog',
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop',
    '2026-03-22'
  ),
  makeArticle(
    '3',
    'Comunicado oficial sobre parcerias internacionais',
    'press_release',
    null,
    '2026-02-15'
  ),
  makeArticle(
    '4',
    'Inscrições abertas para o festival de verão',
    'announcement',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop',
    '2026-01-30'
  ),
];

const makePaginated = (
  docs: News[],
  overrides: Partial<PaginatedDocs<News>> = {}
): PaginatedDocs<News> =>
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
    ...overrides,
  }) as unknown as PaginatedDocs<News>;

const meta = {
  title: 'Pages/News/List',
  component: NewsListComponent,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NewsListComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    news: makePaginated(articles),
    lng: 'en',
  },
};

export const WithPagination: Story = {
  args: {
    news: makePaginated(articles, {
      totalPages: 3,
      page: 2,
      hasPrevPage: true,
      hasNextPage: true,
    }),
    lng: 'en',
  },
};

export const SingleArticle: Story = {
  args: {
    news: makePaginated(articles.slice(0, 1)),
    lng: 'en',
  },
};

export const Empty: Story = {
  args: {
    news: makePaginated([]),
    lng: 'en',
  },
};
