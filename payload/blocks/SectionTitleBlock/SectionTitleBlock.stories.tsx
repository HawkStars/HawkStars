import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SectionTitleBlockComponent } from './Component';

const meta: Meta<typeof SectionTitleBlockComponent> = {
  title: 'Content/SectionTitleBlock',
  component: SectionTitleBlockComponent,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    blockType: 'sectionTitleBlock',
    title: 'Global Village',
    sectionId: 'global-village',
  },
};

export const WithSubtitle: Story = {
  args: {
    blockType: 'sectionTitleBlock',
    title: 'Os nossos espaços',
    subtitle: 'Conheça as áreas que compõem o Global Village em Pinhel.',
    sectionId: 'espacos',
  },
};

export const LongTitle: Story = {
  args: {
    blockType: 'sectionTitleBlock',
    title: 'Transparência e prestação de contas na utilização dos fundos',
    sectionId: 'transparencia',
  },
};

export const LongTitleWithSubtitle: Story = {
  args: {
    blockType: 'sectionTitleBlock',
    title: 'Porque é que o teu apoio faz a diferença',
    subtitle:
      'Cada contribuição, independentemente do valor, ajuda a transformar um edifício devoluto num centro multidisciplinar para toda a região.',
    sectionId: 'apoio',
  },
};
