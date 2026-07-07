import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import NewsListHeader from './NewsListHeader';

const meta = {
  title: 'Pages/News/List Header',
  component: NewsListHeader,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NewsListHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Notícias',
    subtitle: 'Acompanhe as últimas novidades da Associação HawkStars.',
  },
};

export const NoSubtitle: Story = {
  args: {
    title: 'Notícias',
    subtitle: null,
  },
};

export const LongSubtitle: Story = {
  args: {
    title: 'Blog & Comunicados',
    subtitle:
      'Reflexões, comunicados oficiais e histórias da nossa comunidade — tudo o que precisa de saber sobre os projetos culturais e humanitários que desenvolvemos em Pinhel e além-fronteiras.',
  },
};
