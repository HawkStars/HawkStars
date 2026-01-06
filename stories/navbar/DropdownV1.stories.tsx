import DesktopDropdownV1 from '@/components/navbar/DesktopDropdown/DropdownV1';
import type { ImageIcon, ImageType } from '@/payload-types';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  title: 'Header/DropdownV1',
  component: DesktopDropdownV1,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    structure: {
      control: { type: 'select' },
      options: ['single-column', 'two-columns'],
      description: 'Layout structure of the dropdown',
    },
  },
  decorators: [
    (Story) => (
      <div className='min-w-150 rounded-lg border bg-white p-4 shadow-lg'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DesktopDropdownV1>;

export default meta;
type Story = StoryObj<typeof meta>;

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

export const SingleColumnBasic: Story = {
  args: {
    structure: 'single-column',
    links: {
      dropdownNavLink: [
        createLink('About Us', { description: 'Learn more about our organization' }),
        createLink('Our Team', { description: 'Meet the people behind HawkStars' }),
        createLink('History', { description: 'Our journey through the years' }),
        createLink('Contact', { description: 'Get in touch with us' }),
      ],
    },
  },
};

export const SingleColumnWithIcons: Story = {
  args: {
    structure: 'single-column',
    links: {
      dropdownNavLink: [
        createLink('Art Collection', {
          description: 'Explore our art pieces',
          iconType: 'icon',
          icon: 'Palette',
        }),
        createLink('Events', {
          description: 'Upcoming exhibitions and events',
          iconType: 'icon',
          icon: 'Calendar',
        }),
        createLink('Gallery', {
          description: 'Browse our photo gallery',
          iconType: 'icon',
          icon: 'Image',
        }),
        createLink('Store', {
          description: 'Shop our merchandise',
          iconType: 'icon',
          icon: 'ShoppingBag',
        }),
      ],
    },
  },
};

export const TwoColumnsBasic: Story = {
  args: {
    structure: 'two-columns',
    links: {
      dropdownNavLink: [
        createLink('About Us', { description: 'Learn more about our organization' }),
        createLink('Our Team', { description: 'Meet the people behind HawkStars' }),
        createLink('History', { description: 'Our journey through the years' }),
        createLink('Contact', { description: 'Get in touch with us' }),
        createLink('Partners', { description: 'Our valued partners' }),
        createLink('Sponsors', { description: 'Companies supporting us' }),
      ],
    },
  },
};

export const WithFeaturedLinks: Story = {
  args: {
    structure: 'single-column',
    links: {
      dropdownNavLink: [
        createLink('Global Village', {
          featured: true,
          description: 'Our flagship project bringing communities together',
        }),
        createLink('Art Collection', {
          featured: true,
          description: 'Discover our curated art pieces',
        }),
        createLink('About Us', { description: 'Learn more about our organization' }),
        createLink('Our Team', { description: 'Meet the people behind HawkStars' }),
        createLink('History', { description: 'Our journey through the years' }),
      ],
    },
  },
};

export const WithFeaturedAndIcons: Story = {
  args: {
    structure: 'two-columns',
    links: {
      dropdownNavLink: [
        createLink('Global Village', {
          featured: true,
          description: 'Our flagship project bringing communities together',
          iconType: 'icon',
          icon: 'Globe',
        }),
        createLink('Art Collection', {
          description: 'Explore our art pieces',
          iconType: 'icon',
          icon: 'Palette',
        }),
        createLink('Events', {
          description: 'Upcoming exhibitions and events',
          iconType: 'icon',
          icon: 'Calendar',
        }),
        createLink('Gallery', {
          description: 'Browse our photo gallery',
          iconType: 'icon',
          icon: 'Image',
        }),
        createLink('Store', {
          description: 'Shop our merchandise',
          iconType: 'icon',
          icon: 'ShoppingBag',
        }),
        createLink('News', {
          description: 'Latest updates',
          iconType: 'icon',
          icon: 'Newspaper',
        }),
      ],
    },
  },
};

export const ManyItemsTwoColumns: Story = {
  args: {
    structure: 'two-columns',
    links: {
      dropdownNavLink: [
        createLink('About Us', { description: 'Learn about our mission' }),
        createLink('Our Team', { description: 'Meet the team' }),
        createLink('History', { description: 'Our journey' }),
        createLink('Contact', { description: 'Get in touch' }),
        createLink('Partners', { description: 'Our partners' }),
        createLink('Sponsors', { description: 'Our sponsors' }),
        createLink('Careers', { description: 'Join us' }),
        createLink('Press', { description: 'Media resources' }),
      ],
    },
  },
};

export const EmptyLinks: Story = {
  args: {
    structure: 'single-column',
    links: {
      dropdownNavLink: [],
    },
  },
};
