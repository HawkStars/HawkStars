import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import NewsSingleHero from './NewsSingleHero';

const meta = {
  title: 'News/NewsSingleHero',
  component: NewsSingleHero,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NewsSingleHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'HawkStars lança novo projeto Erasmus+',
    type: 'news',
    publishedAt: '2026-04-10T00:00:00.000Z',
    lng: 'en',
    heroImage: {
      url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=400&fit=crop',
      alt: 'Team collaboration',
    },
  },
};

export const PressRelease: Story = {
  args: {
    title: 'Comunicado oficial sobre parcerias internacionais',
    type: 'press_release',
    publishedAt: '2026-02-15T00:00:00.000Z',
    lng: 'pt',
    heroImage: {
      url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=400&fit=crop',
      alt: 'Handshake',
    },
  },
};

export const NoDate: Story = {
  args: {
    title: 'Reflexões sobre o nosso primeiro ano',
    type: 'blog',
    publishedAt: null,
    lng: 'en',
    heroImage: {
      url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop',
      alt: 'Notebook and coffee',
    },
  },
};
