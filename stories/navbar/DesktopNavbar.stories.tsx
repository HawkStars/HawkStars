import DesktopNavbar from '@/components/navbar/DesktopNavbar';
import AppProvider from '@/utils/contexts/AppProvider';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type {
  HeaderNavigationColumns,
  NavbarDropdown,
  ImageIcon,
  ImageType,
} from '@/payload-types';

// Helper to create link items for dropdowns
const createDropdownLink = (
  label: string,
  options?: {
    featured?: boolean;
    description?: string;
    iconType?: 'icon' | 'image';
    icon?: ImageIcon['icon'];
  }
) => ({
  id: `link-${label.toLowerCase().replace(/\s+/g, '-')}`,
  featured: options?.featured ?? false,
  description: options?.description,
  visible: true,
  link: {
    type: 'custom' as const,
    label,
    url: '#',
    newTab: false,
  },
  imageIcon: {
    type: options?.iconType || null,
    icon: ((options?.iconType == 'icon' && options?.icon) || ('Star' as ImageIcon['icon'])) ?? null,
    imageField: {
      imageType: 'external',
      alt: '',
      externalImage:
        'https://images.unsplash.com/photo-1764616683448-322320bce277?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    } as ImageType,
  },
});

const aboutDropdown: NavbarDropdown = {
  dropdownTitle: 'About',
  key: 'about',
  structure: 'single-column',
  links: {
    dropdownNavLink: [
      createDropdownLink('Our Mission', { description: 'Learn about our purpose' }),
      createDropdownLink('Team', { description: 'Meet the team' }),
    ],
  },
};

const projectsDropdown: NavbarDropdown = {
  dropdownTitle: 'Projects',
  key: 'projects',
  structure: 'two-columns',
  links: {
    dropdownNavLink: [
      createDropdownLink('Global Village', { featured: true, description: 'Our flagship project' }),
      createDropdownLink('Events', { description: 'Upcoming exhibitions' }),
    ],
  },
};

const linksOnlyColumns: HeaderNavigationColumns = [
  {
    id: 'home',
    isMultiColumn: false,
    link: { type: 'custom' as const, label: 'Home', url: '/' },
  },
  {
    id: 'about',
    isMultiColumn: false,
    link: { type: 'custom' as const, label: 'About', url: '/about' },
  },
  {
    id: 'news',
    isMultiColumn: false,
    link: { type: 'custom' as const, label: 'News', url: '/news' },
  },
];

const mixedColumns: HeaderNavigationColumns = [
  {
    id: 'home',
    isMultiColumn: false,
    link: { type: 'custom' as const, label: 'Home', url: '/' },
  },
  {
    id: 'about-dropdown',
    isMultiColumn: true,
    dropdown: aboutDropdown,
  },
  {
    id: 'projects-dropdown',
    isMultiColumn: true,
    dropdown: projectsDropdown,
  },
  {
    id: 'contact',
    isMultiColumn: false,
    link: { type: 'custom' as const, label: 'Contact', url: '/contact' },
  },
];

const dropdownsOnlyColumns: HeaderNavigationColumns = [
  {
    id: 'about-dropdown',
    isMultiColumn: true,
    dropdown: aboutDropdown,
  },
  {
    id: 'projects-dropdown',
    isMultiColumn: true,
    dropdown: projectsDropdown,
  },
];

const meta = {
  title: 'Header/DesktopNavbar',
  component: DesktopNavbar,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
  args: {
    handleHoverMenu: () => {},
    menuKeyHovered: null,
    columns: mixedColumns,
  },
  decorators: [
    (Story) => (
      <AppProvider lng='en'>
        {/* DesktopNavbar is hidden below the lg breakpoint */}
        <div className='flex min-h-50 justify-end px-6 py-4'>
          <Story />
        </div>
      </AppProvider>
    ),
  ],
} satisfies Meta<typeof DesktopNavbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LinksOnly: Story = {
  args: {
    columns: linksOnlyColumns,
  },
};

export const DropdownsOnly: Story = {
  args: {
    columns: dropdownsOnlyColumns,
  },
};

export const WithHoveredMenu: Story = {
  args: {
    columns: dropdownsOnlyColumns,
    menuKeyHovered: 'about',
  },
};
