import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { BoardMember } from '@/payload-types';
import AppProvider from '@/utils/contexts/AppProvider';
import TeamCard from './TeamCard';

const baseMember = {
  id: '1',
  name: 'Ana Silva',
  section: 'board',
  title: 'president',
  position: 1,
  photo: {
    id: 'm1',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces',
    alt: 'Ana Silva',
  },
  links: [
    { platform: 'linkedin', url: 'https://linkedin.com', isVisible: true, id: 'l1' },
    { platform: 'email', url: 'mailto:ana@hawkstars.org', isVisible: true, id: 'l2' },
  ],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
} as unknown as BoardMember;

const meta = {
  title: 'Pages/Team/Team Card',
  component: TeamCard,
  parameters: {
    layout: 'centered',
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
} satisfies Meta<typeof TeamCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    member: baseMember,
    lng: 'en',
  },
};

export const WithDepartment: Story = {
  args: {
    member: {
      ...baseMember,
      name: 'João Pereira',
      title: 'department',
      department: 'Comunicação',
      photo: {
        id: 'm2',
        url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces',
        alt: 'João Pereira',
      },
    } as unknown as BoardMember,
    lng: 'en',
  },
};

export const NoLinks: Story = {
  args: {
    member: {
      ...baseMember,
      name: 'Maria Costa',
      title: 'treasurer',
      links: [],
      photo: {
        id: 'm3',
        url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces',
        alt: 'Maria Costa',
      },
    } as unknown as BoardMember,
    lng: 'en',
  },
};

export const NoPhoto: Story = {
  args: {
    member: {
      ...baseMember,
      name: 'Pedro Almeida',
      title: 'vice_president',
      photo: undefined,
    } as unknown as BoardMember,
    lng: 'en',
  },
};
