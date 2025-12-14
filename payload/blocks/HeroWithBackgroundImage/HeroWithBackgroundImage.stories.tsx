import type { Meta, StoryObj } from '@storybook/react';
import { HeroWithBackgroundImageBlock } from './Component';

const meta: Meta<typeof HeroWithBackgroundImageBlock> = {
  title: 'Payload Blocks/HeroWithBackgroundImage',
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
    backgroundImage: {
      id: '1',
      alt: 'Beautiful landscape',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center',
      filename: 'hero-background.jpg',
      mimeType: 'image/jpeg',
      filesize: 500000,
      width: 1920,
      height: 1080,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    title: 'Welcome to Our Mission',
    subtitle:
      'Join us in creating lasting positive change in communities around the world through sustainable development and humanitarian aid.',
    overlayOpacity: 50,
    primaryCtaText: 'Get Started',
    primaryCtaLink: '/contribute',
    secondaryCtaText: 'Learn More',
    secondaryCtaLink: '/about',
    textAlignment: 'center',
    id: '1',
    blockName: 'HeroWithBackgroundImage',
    blockType: 'heroWithBackgroundImage',
  },
};

export const LeftAligned: Story = {
  args: {
    backgroundImage: {
      id: '2',
      alt: 'Community working together',
      url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1920&h=1080&fit=crop&crop=center',
      filename: 'community-hero.jpg',
      mimeType: 'image/jpeg',
      filesize: 450000,
      width: 1920,
      height: 1080,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    title: 'Building Stronger Communities',
    subtitle:
      'Empowering local leaders and fostering sustainable development through community-centered initiatives.',
    overlayOpacity: 60,
    primaryCtaText: 'Join Our Network',
    primaryCtaLink: '/network',
    secondaryCtaText: 'View Projects',
    secondaryCtaLink: '/projects',
    textAlignment: 'left',
    id: '2',
    blockName: 'HeroWithBackgroundImage',
    blockType: 'heroWithBackgroundImage',
  },
};

export const RightAligned: Story = {
  args: {
    backgroundImage: {
      id: '3',
      alt: 'Volunteers helping in the field',
      url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1920&h=1080&fit=crop&crop=center',
      filename: 'volunteers-hero.jpg',
      mimeType: 'image/jpeg',
      filesize: 480000,
      width: 1920,
      height: 1080,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    title: 'Make a Real Difference',
    subtitle:
      'Your contribution creates immediate impact in communities that need it most. Every action counts.',
    overlayOpacity: 40,
    primaryCtaText: 'Donate Now',
    primaryCtaLink: '/donate',
    secondaryCtaText: 'Volunteer',
    secondaryCtaLink: '/volunteer',
    textAlignment: 'right',
    id: '3',
    blockName: 'HeroWithBackgroundImage',
    blockType: 'heroWithBackgroundImage',
  },
};

export const LightOverlay: Story = {
  args: {
    backgroundImage: {
      id: '4',
      alt: 'Bright sunny landscape',
      url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop&crop=center',
      filename: 'bright-landscape.jpg',
      mimeType: 'image/jpeg',
      filesize: 520000,
      width: 1920,
      height: 1080,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    title: 'A Brighter Future Starts Today',
    subtitle: 'Together, we can overcome challenges and build sustainable solutions for tomorrow.',
    overlayOpacity: 20,
    primaryCtaText: 'Explore Opportunities',
    primaryCtaLink: '/opportunities',
    textAlignment: 'center',
    id: '4',
    blockName: 'HeroWithBackgroundImage',
    blockType: 'heroWithBackgroundImage',
  },
};

export const DarkOverlay: Story = {
  args: {
    backgroundImage: {
      id: '5',
      alt: 'Urban cityscape at night',
      url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&h=1080&fit=crop&crop=center',
      filename: 'city-night.jpg',
      mimeType: 'image/jpeg',
      filesize: 410000,
      width: 1920,
      height: 1080,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    title: 'Innovation in Urban Development',
    subtitle:
      'Leveraging technology and community partnerships to address urban challenges and improve quality of life.',
    overlayOpacity: 80,
    primaryCtaText: 'Urban Solutions',
    primaryCtaLink: '/urban',
    secondaryCtaText: 'Case Studies',
    secondaryCtaLink: '/cases',
    textAlignment: 'center',
    id: '5',
    blockName: 'HeroWithBackgroundImage',
    blockType: 'heroWithBackgroundImage',
  },
};

export const SingleCTA: Story = {
  args: {
    backgroundImage: {
      id: '6',
      alt: 'Hands working together',
      url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1920&h=1080&fit=crop&crop=center',
      filename: 'hands-together.jpg',
      mimeType: 'image/jpeg',
      filesize: 350000,
      width: 1920,
      height: 1080,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    title: 'Unity Through Action',
    subtitle:
      'When communities come together with a shared vision, incredible transformations become possible.',
    overlayOpacity: 55,
    primaryCtaText: 'Be Part of Change',
    primaryCtaLink: '/join',
    textAlignment: 'center',
    id: '6',
    blockName: 'HeroWithBackgroundImage',
    blockType: 'heroWithBackgroundImage',
  },
};

export const NoSubtitle: Story = {
  args: {
    backgroundImage: {
      id: '7',
      alt: 'Mountain landscape',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center',
      filename: 'mountain-landscape.jpg',
      mimeType: 'image/jpeg',
      filesize: 480000,
      width: 1920,
      height: 1080,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    title: 'Reach New Heights',
    overlayOpacity: 45,
    primaryCtaText: 'Start Climbing',
    primaryCtaLink: '/start',
    secondaryCtaText: 'Our Story',
    secondaryCtaLink: '/story',
    textAlignment: 'center',
    id: '7',
    blockName: 'HeroWithBackgroundImage',
    blockType: 'heroWithBackgroundImage',
  },
};
