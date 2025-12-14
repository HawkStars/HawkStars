import Navbar from '@/components/navbar/Navbar';
import AppProvider from '@/utils/contexts/AppProvider';
import type { Meta, StoryObj } from '@storybook/react';
import type { NavbarDropdown, Header, ImageIcon } from '@/payload-types';

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
  link: {
    type: 'custom' as const,
    label,
    url: '#',
    newTab: false,
  },
  imageIcon: options?.iconType
    ? {
        type: options.iconType,
        icon: options?.icon || ('Star' as ImageIcon['icon']),
      }
    : undefined,
});

// Sample dropdown configurations
const aboutDropdownV1: NavbarDropdown = {
  version: 'v1',
  dropdownTitle: 'About',
  key: 'about',
  structure: 'single-column',
  links: {
    dropdownNavLink: [
      createDropdownLink('Our Mission', {
        description: 'Learn about our purpose and goals',
        iconType: 'icon',
        icon: 'Target',
      }),
      createDropdownLink('Team', {
        description: 'Meet the people behind HawkStars',
        iconType: 'icon',
        icon: 'Users',
      }),
      createDropdownLink('History', {
        description: 'Our journey through the years',
        iconType: 'icon',
        icon: 'Clock',
      }),
      createDropdownLink('Contact', {
        description: 'Get in touch with us',
        iconType: 'icon',
        icon: 'Mail',
      }),
    ],
  },
};

const projectsDropdownV2: NavbarDropdown = {
  version: 'v2',
  dropdownTitle: 'Projects',
  key: 'projects',
  structure: 'two-columns',
  links: {
    dropdownNavLink: [
      createDropdownLink('Global Village', {
        featured: true,
        description: 'Our flagship project bringing communities together worldwide',
        iconType: 'icon',
        icon: 'Globe',
      }),
      createDropdownLink('Art Collection', {
        description: 'Explore our curated art pieces',
        iconType: 'icon',
        icon: 'Palette',
      }),
      createDropdownLink('Events', {
        description: 'Upcoming exhibitions and gatherings',
        iconType: 'icon',
        icon: 'Calendar',
      }),
      createDropdownLink('Gallery', {
        description: 'Browse our photo gallery',
        iconType: 'icon',
        icon: 'Image',
      }),
      createDropdownLink('Store', {
        description: 'Shop our merchandise',
        iconType: 'icon',
        icon: 'ShoppingBag',
      }),
    ],
  },
};

const artDropdownV1: NavbarDropdown = {
  version: 'v1',
  dropdownTitle: 'Art',
  key: 'art',
  structure: 'two-columns',
  links: {
    dropdownNavLink: [
      createDropdownLink('Art Exhibition', {
        featured: true,
        description: 'Current art exhibition showcase',
      }),
      createDropdownLink('Collection', { description: 'Browse our collection' }),
      createDropdownLink('Artists', { description: 'Featured artists' }),
      createDropdownLink('Curators', { description: 'Meet our curators' }),
      createDropdownLink('Purchase', { description: 'Buy artwork' }),
      createDropdownLink('Donate Art', { description: 'Contribute to our collection' }),
    ],
  },
};

// Sample header configurations
const simpleHeaderInfo: Header = {
  id: 'simple-header',
  columns: [
    {
      id: 'home',
      isMultiColumn: false,
      link: {
        type: 'custom' as const,
        label: 'Home',
        url: '/',
      },
    },
    {
      id: 'about-dropdown',
      isMultiColumn: true,
      dropdown: aboutDropdownV1,
    },
    {
      id: 'news',
      isMultiColumn: false,
      link: {
        type: 'custom' as const,
        label: 'News',
        url: '/news',
      },
    },
  ],
};

const fullHeaderInfo: Header = {
  id: 'full-header',
  columns: [
    {
      id: 'about-dropdown',
      isMultiColumn: true,
      dropdown: aboutDropdownV1,
    },
    {
      id: 'projects-dropdown',
      isMultiColumn: true,
      dropdown: projectsDropdownV2,
    },
    {
      id: 'art-dropdown',
      isMultiColumn: true,
      dropdown: artDropdownV1,
    },
    {
      id: 'news',
      isMultiColumn: false,
      link: {
        type: 'custom' as const,
        label: 'News',
        url: '/news',
      },
    },
    {
      id: 'contact',
      isMultiColumn: false,
      link: {
        type: 'custom' as const,
        label: 'Contact',
        url: '/contact',
      },
    },
  ],
};

const singleLinksHeaderInfo: Header = {
  id: 'single-links-header',
  columns: [
    {
      id: 'home',
      isMultiColumn: false,
      link: {
        type: 'custom' as const,
        label: 'Home',
        url: '/',
      },
    },
    {
      id: 'about',
      isMultiColumn: false,
      link: {
        type: 'custom' as const,
        label: 'About',
        url: '/about',
      },
    },
    {
      id: 'news',
      isMultiColumn: false,
      link: {
        type: 'custom' as const,
        label: 'News',
        url: '/news',
      },
    },
    {
      id: 'contact',
      isMultiColumn: false,
      link: {
        type: 'custom' as const,
        label: 'Contact',
        url: '/contact',
      },
    },
  ],
};

const meta = {
  title: 'Navbar/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      return (
        <AppProvider headerInfo={simpleHeaderInfo} lng='en'>
          <div className='min-h-100'>
            <Story />
          </div>
        </AppProvider>
      );
    },
  ],
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FullNavigation: Story = {
  decorators: [
    (Story) => (
      <AppProvider headerInfo={fullHeaderInfo} lng='en'>
        <div className='min-h-100'>
          <Story />
        </div>
      </AppProvider>
    ),
  ],
};

export const SingleLinksOnly: Story = {
  decorators: [
    (Story) => (
      <AppProvider headerInfo={singleLinksHeaderInfo} lng='en'>
        <div className='min-h-100'>
          <Story />
        </div>
      </AppProvider>
    ),
  ],
};

export const WithDropdownV1: Story = {
  decorators: [
    (Story) => (
      <AppProvider
        headerInfo={{
          id: 'dropdown-v1-header',
          columns: [
            {
              id: 'about-dropdown',
              isMultiColumn: true,
              dropdown: aboutDropdownV1,
            },
            {
              id: 'art-dropdown',
              isMultiColumn: true,
              dropdown: artDropdownV1,
            },
          ],
        }}
        lng='en'
      >
        <div className='min-h-100'>
          <Story />
        </div>
      </AppProvider>
    ),
  ],
};

export const WithDropdownV2: Story = {
  decorators: [
    (Story) => (
      <AppProvider
        headerInfo={{
          id: 'dropdown-v2-header',
          columns: [
            {
              id: 'projects-dropdown',
              isMultiColumn: true,
              dropdown: projectsDropdownV2,
            },
          ],
        }}
        lng='en'
      >
        <div className='min-h-100'>
          <Story />
        </div>
      </AppProvider>
    ),
  ],
};

export const MixedDropdownVersions: Story = {
  decorators: [
    (Story) => (
      <AppProvider
        headerInfo={{
          id: 'mixed-header',
          columns: [
            {
              id: 'about-dropdown',
              isMultiColumn: true,
              dropdown: aboutDropdownV1,
            },
            {
              id: 'projects-dropdown',
              isMultiColumn: true,
              dropdown: projectsDropdownV2,
            },
          ],
        }}
        lng='en'
      >
        <div className='min-h-100'>
          <Story />
        </div>
      </AppProvider>
    ),
  ],
};
