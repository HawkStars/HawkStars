import type { Meta, StoryObj } from '@storybook/react';
import { HeroSlideshowBlock } from './Component';

const meta: Meta<typeof HeroSlideshowBlock> = {
  title: 'Payload Blocks/Hero/Slideshow',
  component: HeroSlideshowBlock,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    textAlignment: {
      control: 'select',
      options: ['left', 'center', 'right'],
    },
    height: {
      control: 'select',
      options: ['fullscreen', 'large', 'medium', 'small'],
    },
    overlayOpacity: {
      control: { type: 'range', min: 0, max: 100, step: 5 },
    },
    autoplayInterval: {
      control: { type: 'range', min: 2000, max: 15000, step: 500 },
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
type Story = StoryObj<typeof HeroSlideshowBlock>;

const createMediaObject = (id: string, url: string, alt: string) => ({
  id,
  alt,
  url,
  filename: `slide-${id}.jpg`,
  mimeType: 'image/jpeg' as const,
  filesize: 500000,
  width: 1920,
  height: 1080,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const Default: Story = {
  args: {
    slides: [
      {
        id: 'slide-1',
        backgroundImage: createMediaObject(
          '1',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center',
          'Mountain landscape'
        ),
        title: 'Welcome to Our Mission',
        subtitle:
          'Join us in creating lasting positive change in communities around the world through sustainable development.',
        ctaText: 'Get Started',
        ctaLink: '/contribute',
      },
      {
        id: 'slide-2',
        backgroundImage: createMediaObject(
          '2',
          'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1920&h=1080&fit=crop&crop=center',
          'Community working together'
        ),
        title: 'Building Stronger Communities',
        subtitle: 'Empowering local leaders through community-centered initiatives.',
        ctaText: 'Join Our Network',
        ctaLink: '/network',
      },
      {
        id: 'slide-3',
        backgroundImage: createMediaObject(
          '3',
          'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1920&h=1080&fit=crop&crop=center',
          'Volunteers helping'
        ),
        title: 'Make a Real Difference',
        subtitle: 'Your contribution creates immediate impact in communities that need it most.',
        ctaText: 'Donate Now',
        ctaLink: '/donate',
      },
    ],
    overlayOpacity: 40,
    textAlignment: 'center',
    autoplay: true,
    autoplayInterval: 5000,
    showNavigation: true,
    showDots: true,
    height: 'large',
    id: '1',
    blockName: 'HeroSlideshow',
    blockType: 'heroSlideshowBlock',
  },
};

export const LeftAligned: Story = {
  args: {
    ...Default.args,
    textAlignment: 'left',
  },
};

export const RightAligned: Story = {
  args: {
    ...Default.args,
    textAlignment: 'right',
  },
};

export const FullScreen: Story = {
  args: {
    ...Default.args,
    height: 'fullscreen',
  },
};

export const SmallHeight: Story = {
  args: {
    ...Default.args,
    height: 'small',
  },
};

export const NoNavigation: Story = {
  args: {
    ...Default.args,
    showNavigation: false,
    showDots: false,
  },
};

export const DotsOnly: Story = {
  args: {
    ...Default.args,
    showNavigation: false,
    showDots: true,
  },
};

export const ArrowsOnly: Story = {
  args: {
    ...Default.args,
    showNavigation: true,
    showDots: false,
  },
};

export const NoAutoplay: Story = {
  args: {
    ...Default.args,
    autoplay: false,
  },
};

export const FastAutoplay: Story = {
  args: {
    ...Default.args,
    autoplayInterval: 2000,
  },
};

export const SlowAutoplay: Story = {
  args: {
    ...Default.args,
    autoplayInterval: 10000,
  },
};

export const DarkOverlay: Story = {
  args: {
    ...Default.args,
    overlayOpacity: 70,
  },
};

export const LightOverlay: Story = {
  args: {
    ...Default.args,
    overlayOpacity: 20,
  },
};

export const SingleSlide: Story = {
  args: {
    slides: [
      {
        id: 'slide-1',
        backgroundImage: createMediaObject(
          '1',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center',
          'Mountain landscape'
        ),
        title: 'Single Slide Hero',
        subtitle: 'This hero has only one slide, so navigation is hidden.',
        ctaText: 'Learn More',
        ctaLink: '/about',
      },
    ],
    overlayOpacity: 40,
    textAlignment: 'center',
    autoplay: true,
    autoplayInterval: 5000,
    showNavigation: true,
    showDots: true,
    height: 'large',
    id: '2',
    blockName: 'HeroSlideshow',
    blockType: 'heroSlideshowBlock',
  },
};

export const ManySlides: Story = {
  args: {
    slides: [
      {
        id: 'slide-1',
        backgroundImage: createMediaObject(
          '1',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center',
          'Mountains'
        ),
        title: 'Slide One',
        subtitle: 'First of many slides',
        ctaText: 'Explore',
        ctaLink: '/1',
      },
      {
        id: 'slide-2',
        backgroundImage: createMediaObject(
          '2',
          'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1920&h=1080&fit=crop&crop=center',
          'Community'
        ),
        title: 'Slide Two',
        subtitle: 'Second slide',
        ctaText: 'Discover',
        ctaLink: '/2',
      },
      {
        id: 'slide-3',
        backgroundImage: createMediaObject(
          '3',
          'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1920&h=1080&fit=crop&crop=center',
          'Volunteers'
        ),
        title: 'Slide Three',
        subtitle: 'Third slide',
        ctaText: 'Join',
        ctaLink: '/3',
      },
      {
        id: 'slide-4',
        backgroundImage: createMediaObject(
          '4',
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop&crop=center',
          'Forest'
        ),
        title: 'Slide Four',
        subtitle: 'Fourth slide',
        ctaText: 'Learn',
        ctaLink: '/4',
      },
      {
        id: 'slide-5',
        backgroundImage: createMediaObject(
          '5',
          'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&h=1080&fit=crop&crop=center',
          'City'
        ),
        title: 'Slide Five',
        subtitle: 'Fifth slide',
        ctaText: 'Connect',
        ctaLink: '/5',
      },
    ],
    overlayOpacity: 50,
    textAlignment: 'center',
    autoplay: true,
    autoplayInterval: 3000,
    showNavigation: true,
    showDots: true,
    height: 'large',
    id: '3',
    blockName: 'HeroSlideshow',
    blockType: 'heroSlideshowBlock',
  },
};

export const NoCTA: Story = {
  args: {
    slides: [
      {
        id: 'slide-1',
        backgroundImage: createMediaObject(
          '1',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center',
          'Mountain landscape'
        ),
        title: 'Content Without Actions',
        subtitle: 'Sometimes you just want to display information without a call to action.',
      },
      {
        id: 'slide-2',
        backgroundImage: createMediaObject(
          '2',
          'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1920&h=1080&fit=crop&crop=center',
          'Community'
        ),
        title: 'Pure Visual Storytelling',
        subtitle: 'Let the images and text speak for themselves.',
      },
    ],
    overlayOpacity: 40,
    textAlignment: 'center',
    autoplay: true,
    autoplayInterval: 5000,
    showNavigation: true,
    showDots: true,
    height: 'large',
    id: '4',
    blockName: 'HeroSlideshow',
    blockType: 'heroSlideshowBlock',
  },
};
