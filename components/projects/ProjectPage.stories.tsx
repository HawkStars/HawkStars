import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HawkProject, Partner } from '@/payload-types';
import ProjectPage from './ProjectPage';

const makePartner = (country: string, logoUrl: string) =>
  ({
    id: `partner-${country}`,
    name: `${country} Organisation`,
    country,
    logo: { id: `logo-${country}`, url: logoUrl, alt: `${country} logo` },
  }) as unknown as Partner;

const project = {
  id: '1',
  heading: 'AI4YOU(th) – AI in Everyday Life',
  slug: 'ai4youth',
  actionType: 'KA152-YOU - Mobility of young people',
  referenceNumber: '2024-1-PT02-KA152-YOU-000232143',
  beneficiary: 'Hawk Stars (Portugal)',
  location: 'Pinhel, Portugal',
  startDate: '2024-09-01',
  endDate: '2025-06-30',
  status: 'published',
  hero: {
    participants: 36,
    fundedAmount: 38064,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  details: {
    text: 'Um projeto de mobilidade jovem dedicado à literacia em inteligência artificial, reunindo jovens de cinco países europeus.',
    phases: [
      { title: 'Preparação', description: 'Reuniões online e planeamento das atividades.' },
      { title: 'Mobilidade', description: 'Encontro presencial de uma semana em Pinhel.' },
      { title: 'Disseminação', description: 'Partilha de resultados nas comunidades locais.' },
    ],
  },
  partnersInformation: {
    partners: [
      {
        id: 'pi-1',
        partner: makePartner(
          'Portugal',
          'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop'
        ),
        reports: [
          {
            id: 'r1',
            platform: 'facebook',
            url: 'https://facebook.com',
            label: 'Disseminação via Facebook',
          },
        ],
      },
      {
        id: 'pi-2',
        partner: makePartner(
          'Spain',
          'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=200&h=200&fit=crop'
        ),
        reports: [],
      },
    ],
  },
  objectives: {
    introduction: 'Com este projeto pretendemos:',
    items: [
      { text: 'Aumentar a literacia digital dos jovens participantes.' },
      { text: 'Promover o pensamento crítico sobre a IA.' },
      { text: 'Reforçar a cooperação entre organizações europeias.' },
    ],
  },
  results: {
    text: 'O projeto envolveu 36 jovens que desenvolveram competências em IA e produziram materiais educativos partilhados com as suas comunidades.',
    resultsImage: {
      imageType: 'external',
      externalImage:
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
      alt: 'Results',
    },
  },
  dissemination: {
    reports: [
      { id: 'd1', label: 'Relatório Final', url: 'https://example.com/report', is_hawk_report: true },
    ],
  },
  gallery: {
    externalImages: [
      {
        url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=400&fit=crop',
        alt: 'Workshop',
      },
      {
        url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop',
        alt: 'Group photo',
      },
    ],
  },
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
} as unknown as HawkProject;

const meta = {
  title: 'Projects/ProjectPage',
  component: ProjectPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProjectPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    project,
  },
};

export const MinimalNoPartners: Story = {
  args: {
    project: {
      id: '2',
      heading: 'Green Roots',
      slug: 'green-roots',
      status: 'published',
      startDate: '2025-04-01',
      endDate: '2025-10-01',
      hero: {},
      details: { text: 'Projeto de reflorestação e sustentabilidade ambiental.' },
      dissemination: { reports: [] },
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    } as unknown as HawkProject,
  },
};
