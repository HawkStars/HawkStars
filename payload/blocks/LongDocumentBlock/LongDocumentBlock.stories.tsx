import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LongDocumentBlock } from './Component';
import type { LongDocumentBlock as LongDocumentBlockType } from '@/payload-types';

const text = (t: string) => ({
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
  text: t,
  type: 'text',
  version: 1,
});
const h2 = (t: string) => ({
  type: 'heading',
  tag: 'h2',
  version: 1,
  direction: null,
  format: '',
  indent: 0,
  children: [text(t)],
});
const p = (t: string) => ({
  type: 'paragraph',
  version: 1,
  direction: null,
  format: '',
  indent: 0,
  textFormat: 0,
  textStyle: '',
  children: [text(t)],
});

const content = {
  root: {
    type: 'root',
    version: 1,
    direction: null,
    format: '',
    indent: 0,
    children: [
      h2('1. Objetivo'),
      p(
        'A presente política estabelece o compromisso institucional com a proteção de todas as crianças.'
      ),
      h2('2. Princípios'),
      p('Interesse superior da criança, tolerância zero e responsabilidade partilhada.'),
      h2('3. Reporte'),
      p('Qualquer suspeita deve ser reportada de imediato pelos canais definidos.'),
    ],
  },
} as unknown as LongDocumentBlockType['content'];

const meta: Meta<typeof LongDocumentBlock> = {
  title: 'Blocks/Content/Long Document',
  component: LongDocumentBlock,
  parameters: { layout: 'fullscreen' },
  argTypes: { background: { control: 'select', options: ['bege', 'white'] } },
};

export default meta;
type Story = StoryObj<typeof LongDocumentBlock>;

export const Default: Story = {
  args: {
    blockType: 'longDocument',
    lng: 'pt',
    eyebrow: 'Texto integral',
    title: 'A política',
    content,
    footnote: 'Os anexos estão no documento PDF.',
    showContents: true,
    background: 'bege',
  },
};

export const WithNote: Story = {
  args: {
    ...Default.args,
    lng: 'en',
    note: 'The official version of this policy is in Portuguese.',
  },
};
