import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { BoardMember } from '@/payload-types';
import { GroupedBoardMembers } from '@/lib/payload/queries/team';
import AppProvider from '@/utils/contexts/AppProvider';
import TeamInformation from './TeamInformation';

const photos = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces',
];

const makeMember = (
  id: string,
  name: string,
  title: BoardMember['title'],
  section: BoardMember['section'],
  position: number,
  photoIdx: number
): BoardMember =>
  ({
    id,
    name,
    title,
    section,
    position,
    photo: { id: `m-${id}`, url: photos[photoIdx % photos.length], alt: name },
    links: [{ platform: 'linkedin', url: 'https://linkedin.com', isVisible: true, id: `l-${id}` }],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  }) as unknown as BoardMember;

const boardMembers: GroupedBoardMembers = {
  board: [
    makeMember('1', 'Ana Silva', 'president', 'board', 1, 0),
    makeMember('2', 'Pedro Almeida', 'vice_president', 'board', 2, 1),
    makeMember('3', 'Maria Costa', 'treasurer', 'board', 3, 2),
  ],
  geral: [
    makeMember('4', 'João Pereira', 'president', 'geral', 1, 3),
    makeMember('5', 'Sofia Martins', 'm_secretary', 'geral', 2, 4),
  ],
  fiscal: [
    makeMember('6', 'Rui Fernandes', 'president', 'fiscal', 1, 0),
    makeMember('7', 'Carla Lopes', 'rapporteur_secretary', 'fiscal', 2, 1),
    makeMember('8', 'Tiago Nunes', 'vogal', 'fiscal', 3, 2),
  ],
};

const meta = {
  title: 'Pages/Team/Team Information',
  component: TeamInformation,
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
        <div className='p-8'>
          <Story />
        </div>
      </AppProvider>
    ),
  ],
} satisfies Meta<typeof TeamInformation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    boardMembers,
    lng: 'en',
  },
};

export const SingleMemberSections: Story = {
  args: {
    boardMembers: {
      board: [makeMember('1', 'Ana Silva', 'president', 'board', 1, 0)],
      geral: [makeMember('4', 'João Pereira', 'president', 'geral', 1, 3)],
      fiscal: [makeMember('6', 'Rui Fernandes', 'president', 'fiscal', 1, 0)],
    },
    lng: 'en',
  },
};

export const EmptySections: Story = {
  args: {
    boardMembers: { board: [], geral: [], fiscal: [] },
    lng: 'en',
  },
};
