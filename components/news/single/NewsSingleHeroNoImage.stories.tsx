import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import NewsSingleHeroNoImage from './NewsSingleHeroNoImage';

const meta = {
  title: 'News/NewsSingleHeroNoImage',
  component: NewsSingleHeroNoImage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NewsSingleHeroNoImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Comunicado oficial sobre parcerias internacionais',
    type: 'press_release',
    publishedAt: '2026-02-15T00:00:00.000Z',
    lng: 'en',
  },
};

export const Blog: Story = {
  args: {
    title: 'Reflexões sobre o nosso primeiro ano de atividade',
    type: 'blog',
    publishedAt: '2026-03-22T00:00:00.000Z',
    lng: 'pt',
  },
};

export const NoDate: Story = {
  args: {
    title: 'Inscrições abertas para o festival de verão',
    type: 'announcement',
    publishedAt: null,
    lng: 'en',
  },
};
