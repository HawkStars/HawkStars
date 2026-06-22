import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { News } from '@/payload-types';
import ProjectNewsSection from './ProjectNewsSection';

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
    'Arranque do projeto AI4YOU(th)',
    'news',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
    '2026-04-10'
  ),
  makeArticle(
    '2',
    'Primeiro encontro de parceiros',
    'announcement',
    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=300&fit=crop',
    '2026-03-22'
  ),
  makeArticle(
    '3',
    'Resultados da primeira fase',
    'press_release',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
    '2026-02-15'
  ),
];

const meta = {
  title: 'Projects/ProjectNewsSection',
  component: ProjectNewsSection,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProjectNewsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    news: articles,
    lng: 'en',
  },
};

export const CustomTitle: Story = {
  args: {
    news: articles,
    lng: 'en',
    title: 'Notícias Relacionadas',
  },
};

export const SingleArticle: Story = {
  args: {
    news: articles.slice(0, 1),
    lng: 'en',
  },
};
