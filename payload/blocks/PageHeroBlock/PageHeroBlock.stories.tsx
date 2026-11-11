import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PageHeroBlock } from './Component';

const meta: Meta<typeof PageHeroBlock> = {
  title: 'Blocks/Hero/Page Hero',
  component: PageHeroBlock,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    variant: { control: 'select', options: ['green', 'bege'] },
    align: { control: 'select', options: ['left', 'center'] },
  },
};

export default meta;
type Story = StoryObj<typeof PageHeroBlock>;

export const Green: Story = {
  args: {
    blockType: 'pageHero',
    lng: 'pt',
    eyebrow: 'Salvaguarda',
    title: 'Política de Proteção de Crianças',
    description:
      'Todas as crianças e jovens que participam nas nossas atividades têm direito a estar seguros.',
    variant: 'green',
    align: 'left',
    links: [
      { link: { type: 'custom', url: '#reportar', label: 'Como reportar', newTab: false } },
      { link: { type: 'custom', url: '/history', label: 'A nossa história', newTab: false } },
    ],
    facts: [
      { id: '1', label: 'Versão', value: '1.0' },
      { id: '2', label: 'Em vigor desde', value: '1 de junho de 2026' },
      { id: '3', label: 'Revisão', value: 'Anual' },
      { id: '4', label: 'Aplica-se a', value: 'Toda a associação, staff, voluntários e parceiros' },
    ],
  },
};

export const BegeCentered: Story = {
  args: { ...Green.args, variant: 'bege', align: 'center' },
};
