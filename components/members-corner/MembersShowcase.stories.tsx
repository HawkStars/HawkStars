import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { MemberProjectDoc } from '@/lib/payload/queries/memberProject';
import MembersShowcase from './MembersShowcase';

// Simple translation stub mapping the keys the component uses.
const translations: Record<string, string> = {
  'showcase.empty': 'No member projects have been published yet.',
  'showcase.watchVideo': 'Watch video',
  'showcase.datesTitle': 'Key dates',
  'showcase.moreInfo': 'More info',
  'languages.pt': 'Portuguese',
  'languages.en': 'English',
  'languages.es': 'Spanish',
};
const t = (key: string) => translations[key] ?? key;

const projects: MemberProjectDoc[] = [
  {
    id: '1',
    title: 'Stars of Pinhel — Documentary',
    description:
      'A short documentary following three young members through a year of Erasmus mobility.',
    language: 'pt',
    image_url:
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=60',
    video_url: 'https://www.youtube.com/watch?v=example',
    dates: [
      { label: 'Premiere screening', date: '2026-05-20', link: 'https://hawkstars.org/agenda' },
      { label: 'Festival submission', date: '2026-07-01', link: null },
    ],
    createdAt: '2026-04-01T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'Coding Club Showcase',
    description: 'Members present the apps they built during the spring coding bootcamp.',
    language: 'en',
    image_url:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=60',
    video_url: null,
    dates: [],
    createdAt: '2026-03-15T00:00:00.000Z',
  },
  {
    id: '3',
    title: 'Community Garden Vlog',
    description: 'A video-only project documenting the building of the community garden.',
    language: 'es',
    image_url: null,
    video_url: 'https://www.youtube.com/watch?v=example2',
    dates: [{ label: 'Harvest day', date: '2026-09-10', link: null }],
    createdAt: '2026-02-10T00:00:00.000Z',
  },
];

const meta = {
  title: 'Misc/MembersShowcase',
  component: MembersShowcase,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MembersShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    projects,
    t,
  },
};

export const Empty: Story = {
  args: {
    projects: [],
    t,
  },
};
