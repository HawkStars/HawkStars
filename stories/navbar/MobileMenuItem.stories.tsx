import MobileMenuItem from '@/components/navbar/MobileNavbar/MobileMenuItem';
import AppProvider from '@/utils/contexts/AppProvider';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { NavbarDropdown, ImageIcon, ImageType } from '@/payload-types';

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
      createDropdownLink('Contact', { description: 'Get in touch' }),
    ],
  },
};

const meta = {
  title: 'Layout/Header/Mobile Menu Item',
  component: MobileMenuItem,
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true,
    },
    backgrounds: {
      default: 'light',
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <AppProvider lng='en'>
        <div className='max-w-xs bg-white'>
          <Story />
        </div>
      </AppProvider>
    ),
  ],
} satisfies Meta<typeof MobileMenuItem>;

export default meta;
type Story = StoryObj<typeof meta>;

// A plain single link (no dropdown)
export const SingleLink: Story = {
  args: {
    data: {
      id: 'home',
      isMultiColumn: false,
      link: { type: 'custom' as const, label: 'Home', url: '/' },
    },
  },
};

// A collapsible dropdown item (expand by clicking the title)
export const DropdownItem: Story = {
  args: {
    data: {
      id: 'about-dropdown',
      isMultiColumn: true,
      dropdown: aboutDropdown,
    },
  },
};
