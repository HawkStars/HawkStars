import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ValuesGridBlock } from './Component';
import type { ValuesGridBlock as ValuesGridBlockType } from '@/payload-types';

type Icon = ValuesGridBlockType['items'][number]['icon'];

const meta: Meta<typeof ValuesGridBlock> = {
  title: 'Blocks/Content/Values Grid',
  component: ValuesGridBlock,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    columns: { control: 'select', options: ['2', '3', '4'] },
    background: { control: 'select', options: ['white', 'bege', 'green'] },
  },
};

export default meta;
type Story = StoryObj<typeof ValuesGridBlock>;

const values: ValuesGridBlockType['items'] = [
  {
    id: '1',
    icon: 'LuTarget' as Icon,
    title: 'Impacto com Propósito',
    description:
      'Cada ação tem uma razão maior: empoderar a comunidade e gerar mudança mensurável.',
  },
  {
    id: '2',
    icon: 'LuGlobe' as Icon,
    title: 'Pensar Global, Agir Local',
    description: 'Honramos Pinhel e o Interior e ligamo-los a redes europeias e internacionais.',
  },
  {
    id: '3',
    icon: 'LuHandshake' as Icon,
    title: 'Cooperação e Comunidade',
    description:
      'Ninguém faz nada sozinho. Trabalhamos em rede e celebramos conquistas em conjunto.',
  },
];

export const Default: Story = {
  args: {
    blockType: 'valuesGrid',
    eyebrow: 'O que nos move',
    title: 'Os nossos valores',
    subtitle: 'Os princípios que orientam cada projeto, decisão e parceria.',
    columns: '3',
    background: 'white',
    items: values,
  },
};

export const Green: Story = {
  args: { ...Default.args, background: 'green' },
};

export const NumberedWithoutIcons: Story = {
  args: {
    ...Default.args,
    title: 'Os nossos 5 pilares',
    background: 'bege',
    numbered: true,
    items: values.map(({ icon: _icon, ...item }) => item),
  },
};
