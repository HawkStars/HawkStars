import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HawkProject, Partner } from '@/payload-types';
import ProjectsSingleHero from './ProjectsSingleHero';

const makePartner = (country: string): { id: string; partner: Partner } => ({
  id: `p-${country}`,
  partner: { id: `partner-${country}`, name: `${country} Org`, country } as unknown as Partner,
});

const partnersInformation = {
  partners: [makePartner('Portugal'), makePartner('Spain'), makePartner('Italy')],
} as unknown as HawkProject['partnersInformation'];

const meta = {
  title: 'Pages/Projects/Single Hero',
  component: ProjectsSingleHero,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProjectsSingleHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    lng: 'pt',
    heading: 'AI4YOU(th) – AI in Everyday Life',
    actionType: 'KA152-YOU - Mobility of young people',
    referenceNumber: '2024-1-PT02-KA152-YOU-000232143',
    beneficiary: 'Hawk Stars (Portugal)',
    location: 'Pinhel, Portugal',
    startDate: '2024-09-01',
    endDate: '2025-06-30',
    partnersInformation,
    hero: {
      participants: 36,
      fundedAmount: 38064,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      projectBadge: {
        imageType: 'external',
        externalImage:
          'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=200&fit=crop',
        alt: 'Project badge',
      },
    },
  },
};

export const NoVideoNoStats: Story = {
  args: {
    lng: 'pt',
    heading: 'Culture Bridges',
    actionType: 'KA210-YOU - Small-scale partnerships',
    referenceNumber: '2025-1-PT02-KA210-YOU-000111222',
    beneficiary: 'Hawk Stars (Portugal)',
    location: 'Pinhel, Portugal',
    startDate: '2025-03-15',
    endDate: null,
    partnersInformation: {
      partners: [makePartner('Portugal'), makePartner('France')],
    } as unknown as HawkProject['partnersInformation'],
    hero: {},
  },
};

export const MinimalSingleDay: Story = {
  args: {
    lng: 'pt',
    heading: 'Encontro de Voluntários',
    startDate: '2026-05-10',
    endDate: null,
    hero: {},
  },
};
