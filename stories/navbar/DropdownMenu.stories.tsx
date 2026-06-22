import DropdownMenu from '@/components/navbar/DesktopDropdown/DropdownMenu';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { NavbarDropdown, ImageIcon, ImageType } from '@/payload-types';

// Helper to create link items
const createLink = (
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

const singleColumnDropdown: NavbarDropdown = {
  dropdownTitle: 'About',
  key: 'about',
  structure: 'single-column',
  links: {
    dropdownNavLink: [
      createLink('About Us', { description: 'Learn more about our organization' }),
      createLink('Our Team', { description: 'Meet the people behind HawkStars' }),
      createLink('History', { description: 'Our journey through the years' }),
      createLink('Contact', { description: 'Get in touch with us' }),
    ],
  },
};

const twoColumnsDropdown: NavbarDropdown = {
  dropdownTitle: 'Projects',
  key: 'projects',
  structure: 'two-columns',
  links: {
    dropdownNavLink: [
      createLink('Global Village', {
        featured: true,
        description: 'Our flagship project',
        iconType: 'icon',
        icon: 'LuGlobe',
      }),
      createLink('Art Collection', {
        description: 'Explore our art pieces',
        iconType: 'icon',
        icon: 'LuPalette',
      }),
      createLink('Events', {
        description: 'Upcoming exhibitions',
        iconType: 'icon',
        icon: 'LuCalendar',
      }),
      createLink('Gallery', {
        description: 'Browse our photo gallery',
        iconType: 'icon',
        icon: 'LuImage',
      }),
    ],
  },
};

const meta = {
  title: 'Header/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className='min-w-150 rounded-lg border bg-white p-4 shadow-lg'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleColumn: Story = {
  args: {
    dropdownInfo: singleColumnDropdown,
  },
};

export const TwoColumns: Story = {
  args: {
    dropdownInfo: twoColumnsDropdown,
  },
};

// Renders nothing when no dropdown info is provided
export const NoDropdownInfo: Story = {
  args: {
    dropdownInfo: undefined,
  },
};
