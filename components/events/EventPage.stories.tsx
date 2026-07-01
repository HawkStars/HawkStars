import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import EventPage from './EventPage';

const fullEvent = {
  heading: 'Festival Cultural de Pinhel 2026',
  subheading: 'Uma celebração da cultura e da comunidade',
  date: '2026-07-12',
  endDate: '2026-07-15',
  isDateRange: true,
  type_event: 'cultural_event',
  description:
    'Junte-se a nós para quatro dias de música, arte e gastronomia tradicional no coração de Pinhel. Um evento aberto a toda a comunidade, com atividades para todas as idades.',
  image: {
    imageType: 'external',
    externalImage:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=675&fit=crop',
    alt: 'Festival crowd at dusk',
  },
  details: {
    text: 'O festival reúne artistas locais e internacionais num programa diverso que celebra as tradições da região, ao mesmo tempo que abre espaço para novas expressões artísticas.',
    sections: [
      {
        title: 'Música ao Vivo',
        text: 'Concertos diários no palco principal, com fado, música popular e bandas convidadas de toda a Europa.',
      },
      {
        title: 'Gastronomia',
        text: 'Tasquinhas com pratos tradicionais e produtos regionais, abertas durante todo o evento.',
      },
    ],
  },
  objectives: {
    introduction: 'Com este evento pretendemos:',
    items: [
      { text: 'Promover a cultura e o património local.' },
      { text: 'Reforçar os laços da comunidade.' },
      { text: 'Atrair visitantes para a região de Pinhel.' },
    ],
  },
  program: [
    { day: 'Dia 1', title: 'Abertura', description: 'Cerimónia de abertura e concerto inaugural.' },
    {
      day: 'Dia 2',
      title: 'Workshops',
      description: 'Oficinas de artesanato e dança tradicional.',
    },
    { day: 'Dia 3', title: 'Gastronomia', description: 'Mostra gastronómica regional.' },
    { day: 'Dia 4', title: 'Encerramento', description: 'Grande concerto de encerramento.' },
  ],
  gallery: {
    externalImages: [
      {
        url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&h=600&fit=crop',
        alt: 'Stage lights',
      },
      {
        url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=600&fit=crop',
        alt: 'Concert crowd',
      },
      {
        url: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600&h=600&fit=crop',
        alt: 'Festival tents',
      },
      {
        url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=600&fit=crop',
        alt: 'Live performance',
      },
    ],
  },
};

const meta = {
  title: 'Events/EventPage',
  component: EventPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EventPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    event: fullEvent,
  },
};

export const SingleDayNoGallery: Story = {
  args: {
    event: {
      heading: 'Workshop de Robótica para Jovens',
      subheading: 'Introdução à programação',
      date: '2026-05-20',
      isDateRange: false,
      type_event: 'workshop',
      description:
        'Um dia inteiro dedicado à introdução à robótica e programação, orientado a jovens dos 12 aos 18 anos.',
      details: {
        text: 'Os participantes irão montar e programar o seu primeiro robô, com o apoio de monitores experientes.',
      },
    },
  },
};

export const MinimalEvent: Story = {
  args: {
    event: {
      heading: 'Reunião Geral de Associados',
      date: '2026-03-01',
    },
  },
};

export const NoImageWithObjectives: Story = {
  args: {
    event: {
      heading: 'Campanha de Recolha de Alimentos',
      subheading: 'Solidariedade em ação',
      date: '2026-11-10',
      type_event: 'humanitarian',
      description: 'Recolha de bens alimentares para famílias carenciadas da região.',
      objectives: {
        introduction: 'Os objetivos desta campanha são:',
        items: [
          { text: 'Apoiar 50 famílias da região de Pinhel.' },
          { text: 'Sensibilizar a comunidade para a solidariedade.' },
        ],
      },
    },
  },
};
