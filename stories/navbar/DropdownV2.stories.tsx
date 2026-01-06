import DesktopDropdownV2 from '@/components/navbar/DesktopDropdown/DropdownV2';
import type { ImageIcon } from '@/payload-types';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  title: 'Header/DropdownV2',
  component: DesktopDropdownV2,
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
      <div className='min-w-200 rounded-lg border bg-white p-4 shadow-lg'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DesktopDropdownV2>;

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
  imageIcon:
    options?.iconType == 'image'
      ? {
          type: 'image' as const,
          icon: undefined,
          imageField: {
            imageType: 'external' as const,
            alt: `${label} image`,
            externalImage:
              'https://images.unsplash.com/photo-1764616683448-322320bce277?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          },
        }
      : ({
          type: 'icon' as const,
          icon: options?.icon || ('Star' as ImageIcon['icon']),
          imageField: { externalImage: '', alt: '', imageType: 'external' },
        } as ImageIcon),
});

export const SingleColumnBasic: Story = {
  args: {
    structure: 'single-column',
    links: {
      dropdownNavLink: [
        createLink('About Us', { description: 'Learn more about our organization' }),
        createLink('Our Team', { description: 'Meet the people behind HawkStars' }),
        createLink('History', { description: 'Our journey through the years' }),
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
      ],
    },
  },
};

export const TwoColumnsWithIcons: Story = {
  args: {
    structure: 'two-columns',
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

export const WithFeaturedLink: Story = {
  args: {
    structure: 'two-columns',
    links: {
      dropdownNavLink: [
        createLink('Global Village', {
          featured: true,
          description: 'Our flagship project bringing communities together worldwide',
        }),
        createLink('Art Collection', {
          description: 'Explore our art pieces',
          iconType: 'icon',
          icon: 'Palette',
        }),
        createLink('Events', {
          description: 'Upcoming exhibitions',
          iconType: 'icon',
          icon: 'Calendar',
        }),
        createLink('Gallery', {
          description: 'Photo gallery',
          iconType: 'icon',
          icon: 'Image',
        }),
        createLink('Store', {
          description: 'Shop merchandise',
          iconType: 'icon',
          icon: 'ShoppingBag',
        }),
      ],
    },
  },
};

export const MultipleFeaturedLinks: Story = {
  args: {
    structure: 'two-columns',
    links: {
      dropdownNavLink: [
        createLink('Global Village', {
          featured: true,
          description: 'Our flagship project bringing communities together',
          iconType: 'image',
        }),
        createLink('Art Exhibition', {
          featured: true,
          description: 'Current exhibition showcase',
        }),
        createLink('About Us', { description: 'Learn about our mission' }),
        createLink('Our Team', { description: 'Meet the team' }),
        createLink('Contact', { description: 'Get in touch' }),
        createLink('Partners', { description: 'Our partners' }),
      ],
    },
  },
};

export const FeaturedWithIcon: Story = {
  args: {
    structure: 'two-columns',
    links: {
      dropdownNavLink: [
        createLink('Global Village', {
          featured: true,
          description: 'Community project bringing people together',
          iconType: 'icon',
          icon: 'Globe',
        }),
        createLink('Art Collection', {
          description: 'Explore art',
          iconType: 'icon',
          icon: 'Palette',
        }),
        createLink('Events', {
          description: 'Exhibitions',
          iconType: 'icon',
          icon: 'Calendar',
        }),
        createLink('Gallery', {
          description: 'Photos',
          iconType: 'icon',
          icon: 'Image',
        }),
        createLink('Store', {
          description: 'Merchandise',
          iconType: 'icon',
          icon: 'ShoppingBag',
        }),
      ],
    },
  },
};

export const SingleColumnFeatured: Story = {
  args: {
    structure: 'single-column',
    links: {
      dropdownNavLink: [
        createLink('Featured Project', {
          featured: true,
          description: 'Our main highlight project',
          iconType: 'icon',
          icon: 'Star',
        }),
        createLink('Item One', { description: 'First item' }),
        createLink('Item Two', { description: 'Second item' }),
        createLink('Item Three', { description: 'Third item' }),
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
