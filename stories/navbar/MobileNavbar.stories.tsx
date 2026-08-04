import MobileNavbar from '@/components/navbar/MobileNavbar';
import AppProvider, { useSetMobileNavbarOpen } from '@/utils/contexts/AppProvider';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useEffect } from 'react';
import type { Header, NavbarDropdown, ImageIcon, ImageType } from '@/payload-types';

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
      createDropdownLink('History', { description: 'Our journey' }),
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

const simpleHeaderInfo: Header = {
  id: 'mobile-simple-header',
  columns: [
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
      id: 'news',
      isMultiColumn: false,
      link: { type: 'custom' as const, label: 'News', url: '/news' },
    },
  ],
};

const fullHeaderInfo: Header = {
  id: 'mobile-full-header',
  columns: [
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
  ],
};

// MobileNavbar renders null unless mobileNavbarOpen is true, so open it on mount.
const MobileNavbarOpener = ({ headerInfo }: { headerInfo: Header }) => {
  const setOpen = useSetMobileNavbarOpen();
  useEffect(() => {
    setOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <MobileNavbar headerInfo={headerInfo} />;
};

const meta = {
  title: 'Layout/Header/Mobile Navbar',
  component: MobileNavbar,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
    viewport: {
      defaultViewport: 'mobile1',
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
  render: () => <MobileNavbarOpener headerInfo={simpleHeaderInfo} />,
} satisfies Meta<typeof MobileNavbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FullNavigation: Story = {
  decorators: [
    (Story) => (
      <AppProvider lng='en'>
        <Story lng='en' />
      </AppProvider>
    ),
  ],
  args: {
    headerInfo: fullHeaderInfo,
  },
};

export const Portuguese: Story = {
  decorators: [
    (Story) => (
      <AppProvider lng='pt'>
        <Story />
      </AppProvider>
    ),
  ],
  args: {
    headerInfo: fullHeaderInfo,
  },
};
