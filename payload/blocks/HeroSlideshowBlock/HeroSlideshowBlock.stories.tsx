import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HeroSlideshowBlock } from './Component';
import { createPayloadLink } from '@/utils/storybook';

const meta: Meta<typeof HeroSlideshowBlock> = {
  title: 'Hero/Slideshow',
  component: HeroSlideshowBlock,
  parameters: {
    layout: 'fullscreen',
  },

  argTypes: {
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
    slides: {
      object: {
        backgroundImage: {
          title: 'Welcome to Our Mission',
          subtitle:
            'Join us in creating lasting positive change in communities around the world through sustainable development.',
          textAlignment: 'left',
        },
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof HeroSlideshowBlock>;

export const Default: Story = {
  args: {
    slides: [
      {
        backgroundImage: {
          externalImage:
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center',
          image: null,
          imageType: 'external' as const,
          alt: 'Mountain landscape',
        },
        title: 'Welcome to Our Mission',
        subtitle:
          'Join us in creating lasting positive change in communities around the world through sustainable development.',
        links: [{ link: createPayloadLink('custom', '#contribute', true, 'Get started') }],
        textAlignment: 'left',
      },
      {
        backgroundImage: {
          externalImage:
            'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1920&h=1080&fit=crop&crop=center',
          image: null,
          imageType: 'external' as const,
          alt: 'Community working together',
        },
        title: 'Building Stronger Communities',
        subtitle: 'Empowering local leaders through community-centered initiatives.',
        links: [{ link: createPayloadLink('custom', '#network', true, 'Join Our Network') }],
        textAlignment: 'left',
      },
      {
        backgroundImage: {
          externalImage:
            'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1920&h=1080&fit=crop&crop=center',
          image: null,
          imageType: 'external' as const,
          alt: 'Volunteers helping',
        },
        title: 'Make a Real Difference',
        subtitle: 'Your contribution creates immediate impact in communities that need it most.',
        links: [{ link: createPayloadLink('custom', '#donate', true, 'Donate Noew') }],
        textAlignment: 'center',
      },
    ],
    overlayOpacity: 40,

    autoplay: true,
    autoplayInterval: 5000,
    showNavigation: true,
    showDots: true,
    height: 'large',
  },
};

export const LeftAligned: Story = {
  args: {
    ...Default.args,
  },
};

export const RightAligned: Story = {
  args: {
    ...Default.args,
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
        backgroundImage: {
          externalImage:
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center',
          image: null,
          imageType: 'external' as const,
          alt: 'Mountain landscape',
        },

        title: 'Single Slide Hero',
        subtitle: 'This hero has only one slide, so navigation is hidden.',
        links: [{ link: createPayloadLink('custom', '#about', true, 'Learn More') }],
        textAlignment: 'center',
      },
    ],
    overlayOpacity: 40,
    autoplay: true,
    autoplayInterval: 5000,
    showNavigation: true,
    showDots: true,
    height: 'large',
  },
};

export const ManySlides: Story = {
  args: {
    slides: [
      {
        backgroundImage: {
          externalImage:
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center',
          image: null,
          imageType: 'external' as const,
          alt: 'Mountains',
        },
        title: 'Slide One',
        subtitle: 'First of many slides',
        links: [{ link: createPayloadLink('custom', '#explore', true, 'Explore') }],
        textAlignment: 'left',
      },
      {
        backgroundImage: {
          externalImage:
            'https://images.unsplash.com/photo-1559027615-cd4628905-cd4628902d4a?w=1920&h=1080&fit=crop&crop=center',
          image: null,
          imageType: 'external' as const,
          alt: 'Community',
        },
        title: 'Slide Two',
        subtitle: 'Second slide',
        links: [{ link: createPayloadLink('custom', '#', true, 'Discover') }],
        textAlignment: 'right',
      },
      {
        backgroundImage: {
          externalImage:
            'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1920&h=1080&fit=crop&crop=center',
          image: null,
          imageType: 'external' as const,
          alt: 'Volunteers',
        },
        title: 'Slide Three',
        subtitle: 'Third slide',
        links: [{ link: createPayloadLink('custom', '#contribute', true, 'Get started') }],
        textAlignment: 'center',
      },
      {
        backgroundImage: {
          externalImage:
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop&crop=center',
          image: null,
          imageType: 'external' as const,
          alt: 'Forest',
        },
        title: 'Slide Four',
        subtitle: 'Fourth slide',
        links: [{ link: createPayloadLink('custom', '#contribute', true, 'Learn') }],
        textAlignment: 'left',
      },
      {
        backgroundImage: {
          externalImage:
            'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&h=1080&fit=crop&crop=center',
          image: null,
          imageType: 'external' as const,
          alt: 'City',
        },
        title: 'Slide Five',
        subtitle: 'Fifth slide',
        links: [{ link: createPayloadLink('custom', '#contribute', true, 'Connect') }],
        textAlignment: 'center',
      },
    ],
    overlayOpacity: 50,
    autoplay: true,
    autoplayInterval: 3000,
    showNavigation: true,
    showDots: true,
    height: 'large',
  },
};

export const NoCTA: Story = {
  args: {
    slides: [
      {
        backgroundImage: {
          externalImage:
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center',
          image: null,
          imageType: 'external' as const,
          alt: 'Mountain landscape',
        },
        title: 'Content Without Actions',
        subtitle: 'Sometimes you just want to display information without a call to action.',
        textAlignment: 'left',
      },
      {
        backgroundImage: {
          externalImage:
            'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1920&h=1080&fit=crop&crop=center',
          image: null,
          imageType: 'external' as const,
          alt: 'Community',
        },
        title: 'Pure Visual Storytelling',
        subtitle: 'Let the images and text speak for themselves.',
        textAlignment: 'center',
      },
    ],
    overlayOpacity: 40,
    autoplay: true,
    autoplayInterval: 5000,
    showNavigation: true,
    showDots: true,
    height: 'large',
  },
};
