import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HawkProject } from '@/payload-types';
import ProjectCard from './ProjectCard';

const baseProject = {
  id: '1',
  heading: 'AI4YOU(th) – AI in Everyday Life',
  slug: 'ai4youth',
  startDate: '2024-09-01',
  endDate: '2025-06-30',
  coverImage: {
    imageType: 'external',
    externalImage:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop',
    alt: 'AI project',
  },
  status: 'published',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
} as unknown as HawkProject;

const meta = {
  title: 'Pages/Projects/Project Card',
  component: ProjectCard,
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProjectCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    project: baseProject,
    index: 0,
    lng: 'en',
  },
};

export const SingleDate: Story = {
  args: {
    project: {
      ...baseProject,
      heading: 'Green Roots',
      slug: 'green-roots',
      endDate: null,
    } as unknown as HawkProject,
    index: 1,
    lng: 'en',
  },
};

export const NoImage: Story = {
  args: {
    project: {
      ...baseProject,
      heading: 'Culture Bridges',
      slug: 'culture-bridges',
      coverImage: undefined,
    } as unknown as HawkProject,
    index: 2,
    lng: 'en',
  },
};
