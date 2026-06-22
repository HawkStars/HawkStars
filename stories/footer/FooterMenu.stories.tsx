import FooterMenu from '@/components/footer/FooterMenu';
import AppProvider from '@/utils/contexts/AppProvider';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { FooterColumn } from '@/components/footer/config';

// FooterMenu only renders items whose link has `visible` set truthy.
const createMenuLink = (label: string, url: string = '#') => ({
  id: `link-${label.toLowerCase().replace(/\s+/g, '-')}`,
  visible: true,
  link: {
    type: 'custom' as const,
    label,
    url,
    newTab: false,
    visible: true,
  },
});

const aboutColumn: FooterColumn = {
  column: {
    title: 'About HawkStars',
    data: [
      createMenuLink('Our Mission', '/about'),
      createMenuLink('Team', '/team'),
      createMenuLink('History', '/history'),
      createMenuLink('Partners', '/partners'),
    ],
  },
};

const projectsColumn: FooterColumn = {
  column: {
    title: 'Projects',
    data: [
      createMenuLink('Global Village', '/village'),
      createMenuLink('Art Collection', '/art'),
      createMenuLink('Events', '/events'),
    ],
  },
};

const emptyColumn: FooterColumn = {
  column: {
    title: 'Coming Soon',
    data: [],
  },
};

const meta = {
  title: 'Navigation/FooterMenu',
  component: FooterMenu,
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <AppProvider lng='en'>
        <div className='bg-bege-light min-h-25 px-4 py-4'>
          <Story />
        </div>
      </AppProvider>
    ),
  ],
} satisfies Meta<typeof FooterMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: aboutColumn,
  },
};

export const ShortColumn: Story = {
  args: {
    data: projectsColumn,
  },
};

// Column with a title but no links renders only the heading
export const EmptyColumn: Story = {
  args: {
    data: emptyColumn,
  },
};
