import Navbar from '@/components/navbar/Navbar';
import AppProvider from '@/utils/contexts/AppProvider';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { NavbarDropdown, Header, ImageIcon, ImageType } from '@/payload-types';

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

// Sample dropdown configurations
const aboutDropdown: NavbarDropdown = {
  dropdownTitle: 'About',
  key: 'about',
  structure: 'single-column',
  links: {
    dropdownNavLink: [
      createDropdownLink('Our Mission', {
        description: 'Learn about our purpose and goals',
        iconType: 'icon',
        icon: 'LuStar',
      }),
      createDropdownLink('Team', {
        description: 'Meet the people behind HawkStars',
        iconType: 'icon',
        icon: 'LuUsers',
      }),
      createDropdownLink('History', {
        description: 'Our journey through the years',
        iconType: 'icon',
        icon: 'LuClock',
      }),
      createDropdownLink('Contact', {
        description: 'Get in touch with us',
        iconType: 'icon',
        icon: 'LuMail',
      }),
    ],
  },
};

const projectsDropdown: NavbarDropdown = {
  dropdownTitle: 'Projects',
  key: 'projects',
  structure: 'two-columns',
  links: {
    dropdownNavLink: [
      createDropdownLink('Global Village', {
        featured: true,
        description: 'Our flagship project bringing communities together worldwide',
        iconType: 'icon',
        icon: 'LuGlobe',
      }),
      createDropdownLink('Art Collection', {
        description: 'Explore our curated art pieces',
        iconType: 'icon',
        icon: 'LuPalette',
      }),
      createDropdownLink('Events', {
        description: 'Upcoming exhibitions and gatherings',
        iconType: 'icon',
        icon: 'LuCalendar',
      }),
      createDropdownLink('Gallery', {
        description: 'Browse our photo gallery',
        iconType: 'icon',
        icon: 'LuImage',
      }),
      createDropdownLink('Store', {
        description: 'Shop our merchandise',
        iconType: 'icon',
        icon: 'LuShoppingBag',
      }),
    ],
  },
};

const artDropdown: NavbarDropdown = {
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
      dropdown: aboutDropdown,
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
      dropdown: aboutDropdown,
    },
    {
      id: 'projects-dropdown',
      isMultiColumn: true,
      dropdown: projectsDropdown,
    },
    {
      id: 'art-dropdown',
      isMultiColumn: true,
      dropdown: artDropdown,
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
  title: 'Layout/Header/Navbar',
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
        <AppProvider lng='en'>
          <div className='min-h-100'>
            <Story headerInfo={simpleHeaderInfo} />
          </div>
        </AppProvider>
      );
    },
  ],
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FullNavigation: Story = {
  decorators: [
    (Story) => (
      <AppProvider lng='en'>
        <div className='min-h-100'>
          <Story lng='en' />
        </div>
      </AppProvider>
    ),
  ],
  args: {
    headerInfo: fullHeaderInfo,
    lng: 'en',
  },
};

export const SingleLinksOnly: Story = {
  decorators: [
    (Story) => (
      <AppProvider lng='en'>
        <div className='min-h-100'>
          <Story />
        </div>
      </AppProvider>
    ),
  ],
  args: {
    headerInfo: singleLinksHeaderInfo,
    lng: 'en',
  },
};

export const WithDropdowns: Story = {
  decorators: [
    (Story) => (
      <AppProvider lng='en'>
        <div className='min-h-100'>
          <Story />
        </div>
      </AppProvider>
    ),
  ],
  args: {
    headerInfo: {
      id: 'dropdowns-header',
      columns: [
        {
          id: 'about-dropdown',
          isMultiColumn: true,
          dropdown: aboutDropdown,
        },
        {
          id: 'art-dropdown',
          isMultiColumn: true,
          dropdown: artDropdown,
        },
      ],
    },
    lng: 'en',
  },
};

export const WithProjectsDropdown: Story = {
  decorators: [
    (Story) => (
      <AppProvider lng='en'>
        <div className='min-h-100'>
          <Story />
        </div>
      </AppProvider>
    ),
  ],
  args: {
    headerInfo: {
      id: 'projects-header',
      columns: [
        {
          id: 'projects-dropdown',
          isMultiColumn: true,
          dropdown: projectsDropdown,
        },
      ],
    },
    lng: 'en',
  },
};

export const MultipleDropdowns: Story = {
  decorators: [
    (Story) => {
      return (
        <AppProvider lng='en'>
          <div className='min-h-100'>
            <Story />
          </div>
        </AppProvider>
      );
    },
  ],
  args: {
    headerInfo: {
      id: 'multi-dropdown-header',
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
      ],
    },
    lng: 'en',
  },
};
