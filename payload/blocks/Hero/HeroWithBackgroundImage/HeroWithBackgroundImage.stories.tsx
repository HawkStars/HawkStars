import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HeroWithBackgroundImageBlock } from './Component';
import { createPayloadExternalImage, createPayloadLink } from '@/utils/storybook';

const meta: Meta<typeof HeroWithBackgroundImageBlock> = {
  title: 'Hero/Background Image',
  component: HeroWithBackgroundImageBlock,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    textAlignment: {
      control: 'select',
      options: ['left', 'center', 'right'],
    },
    overlayOpacity: {
      control: { type: 'range', min: 0, max: 100, step: 5 },
    },
    blockType: {
      table: {
        disable: true,
      },
    },
    id: {
      table: {
        disable: true,
      },
    },
    blockName: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof HeroWithBackgroundImageBlock>;

export const Default: Story = {
  args: {
    backgroundImage: createPayloadExternalImage(
      'external',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center',
      'Beautiful landscape'
    ),
    title: 'Welcome to Our Mission',
    subtitle:
      'Join us in creating lasting positive change in communities around the world through sustainable development and humanitarian aid.',
    overlayOpacity: 50,
    links: [
      { link: createPayloadLink('custom', '/learn-more', false, 'Learn More') },
      { link: createPayloadLink('custom', '/contact-us', false, 'Contact Us') },
    ],
    textAlignment: 'center',
    id: '1',
    blockName: 'HeroWithBackgroundImage',
    blockType: 'heroWithBackgroundImage',
  },
};

export const CommunityBuilding: Story = {
  parameters: {
    title: 'Hero/HeroWithBackgroundImage/Community Building',
  },
  args: {
    backgroundImage: createPayloadExternalImage(
      'external',
      'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1920&h=1080&fit=crop&crop=center',
      'Community working together'
    ),

    title: 'Building Stronger Communities',
    subtitle:
      'Empowering local leaders and fostering sustainable development through community-centered initiatives.',
    overlayOpacity: 60,
    links: [
      { link: createPayloadLink('custom', '#', false, 'Join Our Network') },
      { link: createPayloadLink('custom', '#', false, 'View Projects') },
    ],
    textAlignment: 'left',
    id: '2',
    blockName: 'HeroWithBackgroundImage',
    blockType: 'heroWithBackgroundImage',
  },
};

export const DonationCampaign: Story = {
  parameters: {
    title: 'Hero/HeroWithBackgroundImage/Donation Campaign',
  },
  args: {
    backgroundImage: createPayloadExternalImage(
      'external',
      'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1920&h=1080&fit=crop&crop=center',
      'Community working together'
    ),
    title: 'Make a Real Difference',
    subtitle:
      'Your contribution creates immediate impact in communities that need it most. Every action counts.',
    overlayOpacity: 40,
    links: [
      { link: createPayloadLink('custom', '#', false, 'Donate now') },
      { link: createPayloadLink('custom', '#', false, 'Volunteer') },
    ],
    textAlignment: 'right',
    id: '3',
    blockName: 'HeroWithBackgroundImage',
    blockType: 'heroWithBackgroundImage',
  },
};

export const BrightBackground: Story = {
  parameters: {
    title: 'Hero/HeroWithBackgroundImage/Overlay Styles',
  },
  args: {
    backgroundImage: createPayloadExternalImage(
      'external',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop&crop=center',
      'Bright sunny landscape'
    ),
    title: 'A Brighter Future Starts Today',
    subtitle: 'Together, we can overcome challenges and build sustainable solutions for tomorrow.',
    overlayOpacity: 20,
    links: [{ link: createPayloadLink('custom', '#', false, 'Explore Opportunities') }],
    textAlignment: 'center',
    id: '4',
    blockName: 'HeroWithBackgroundImage',
    blockType: 'heroWithBackgroundImage',
  },
};

export const UrbanDevelopment: Story = {
  parameters: {
    title: 'Hero/HeroWithBackgroundImage/Urban Development',
  },
  args: {
    backgroundImage: createPayloadExternalImage(
      'external',
      'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&h=1080&fit=crop&crop=center',
      'Urban cityscape at night'
    ),
    title: 'Innovation in Urban Development',
    subtitle:
      'Leveraging technology and community partnerships to address urban challenges and improve quality of life.',
    overlayOpacity: 80,
    links: [
      { link: createPayloadLink('custom', '#', false, 'Urban Solutions') },
      { link: createPayloadLink('custom', '#', false, 'Case Studies') },
    ],
    textAlignment: 'center',
    id: '5',
    blockName: 'HeroWithBackgroundImage',
    blockType: 'heroWithBackgroundImage',
  },
};

export const UnityCampaign: Story = {
  parameters: {
    title: 'Hero/HeroWithBackgroundImage/Unity Campaign',
  },
  args: {
    backgroundImage: createPayloadExternalImage(
      'external',
      'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1920&h=1080&fit=crop&crop=center',
      'Hands working together'
    ),
    title: 'Unity Through Action',
    subtitle:
      'When communities come together with a shared vision, incredible transformations become possible.',
    overlayOpacity: 55,
    links: [{ link: createPayloadLink('custom', '#', false, 'Be Part of Change') }],
    textAlignment: 'center',
    id: '6',
    blockName: 'HeroWithBackgroundImage',
    blockType: 'heroWithBackgroundImage',
  },
};

export const MinimalistDesign: Story = {
  parameters: {
    title: 'Hero/HeroWithBackgroundImage/Minimalist Design',
  },
  args: {
    backgroundImage: createPayloadExternalImage(
      'external',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center',
      'Mountain landscape'
    ),
    title: 'Reach New Heights',
    overlayOpacity: 45,
    links: [
      { link: createPayloadLink('custom', '#', false, 'Start Climbing') },
      { link: createPayloadLink('custom', '#', false, 'Our Story') },
    ],
    textAlignment: 'center',
    id: '7',
    blockName: 'HeroWithBackgroundImage',
    blockType: 'heroWithBackgroundImage',
  },
};
