import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Sede3DCtaBlock } from './Component';

const meta: Meta<typeof Sede3DCtaBlock> = {
  title: 'Blocks/CTA/Sede 3D',
  component: Sede3DCtaBlock,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    lng: { control: 'select', options: ['pt', 'en'] },
  },
};

export default meta;
type Story = StoryObj<typeof Sede3DCtaBlock>;

export const Default: Story = {
  args: {
    blockType: 'sede3dCta',
    lng: 'pt',
    title: 'Visita a futura sede antes de ela existir',
    description:
      'Percorre os pisos do Global Village – International Training Center e descobre as salas de formação, o coworking, o gaming hub e o estúdio de gravação.',
    highlights: [
      { id: '1', label: '3 salas de formação' },
      { id: '2', label: 'Auditório' },
      { id: '3', label: 'Coworking' },
      { id: '4', label: 'Gaming hub' },
    ],
  },
};

export const English: Story = {
  args: {
    ...Default.args,
    lng: 'en',
    title: 'Walk through our future headquarters',
    description: 'Explore every floor of the Global Village – International Training Center.',
    highlights: [],
  },
};
