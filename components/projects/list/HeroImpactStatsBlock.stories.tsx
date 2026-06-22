import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LinkGroupItem } from '@/payload-types';
import AppProvider from '@/utils/contexts/AppProvider';
import HeroImpactStatsBlock from './HeroImpactStatsBlock';

const sampleStats = [
  { icon: 'Users', number: '500+', label: 'Jovens envolvidos' },
  { icon: 'Globe', number: '5', label: 'Países parceiros' },
  { icon: 'Calendar', number: '30+', label: 'Eventos realizados' },
  { icon: 'Heart', number: '€250k', label: 'Fundos angariados' },
];

const sampleLinks = [
  { link: { type: 'custom', url: '/contribute', newTab: false, label: 'Participar' } },
  { link: { type: 'custom', url: '/about', newTab: false, label: 'Saber mais' } },
] as unknown as LinkGroupItem;

const meta = {
  title: 'Projects/HeroImpactStatsBlock',
  component: HeroImpactStatsBlock,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <AppProvider lng='en'>
        <Story />
      </AppProvider>
    ),
  ],
} satisfies Meta<typeof HeroImpactStatsBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    badge: 'O nosso impacto',
    title: 'Construímos pontes entre comunidades',
    subtitle:
      'A Associação HawkStars promove a cultura, a solidariedade e a mobilidade jovem em Pinhel e além-fronteiras.',
    stats: sampleStats,
    links: sampleLinks,
    heroImage: {
      imageType: 'external',
      externalImage:
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop',
      alt: 'Community impact',
    },
  },
};

export const WithoutImage: Story = {
  args: {
    ...Default.args,
    heroImage: undefined,
  },
};

export const MinimalNoStatsNoCta: Story = {
  args: {
    title: 'A nossa missão',
    subtitle: 'Promover a cultura e a solidariedade.',
    stats: [],
    links: [],
    heroImage: {
      imageType: 'external',
      externalImage:
        'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop',
      alt: 'Mission',
    },
  },
};
