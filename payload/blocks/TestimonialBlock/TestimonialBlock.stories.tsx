import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TestimonialBlock } from './Component';

const meta: Meta<typeof TestimonialBlock> = {
  title: 'Cards/TestimonialBlock',
  component: TestimonialBlock,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    layout: {
      control: 'select',
      options: ['single', 'two-cols', 'three-cols', 'carousel', 'masonry'],
      description: 'How testimonials are arranged',
    },
    style: {
      control: 'select',
      options: ['card', 'quote', 'minimal', 'bubble'],
      description: 'Visual style of each testimonial',
    },
    showRatings: {
      control: 'boolean',
      description: 'Show star ratings under each quote',
    },
    backgroundColor: {
      control: 'select',
      options: ['none', 'gray', 'dark'],
      description: 'Section background colour',
    },
    title: { control: 'text' },
    subtitle: { control: 'text' },
    blockType: { table: { disable: true } },
    id: { table: { disable: true } },
    blockName: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof TestimonialBlock>;

const sampleTestimonials = [
  {
    quote:
      'This platform has transformed the way we work. The features are intuitive and powerful.',
    author: {
      name: 'Sarah Johnson',
      title: 'CEO',
      company: 'Tech Innovations Inc.',
      avatar: {
        externalImage:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        imageType: 'external' as const,
        alt: 'Sarah Johnson',
      },
    },
    rating: 5,
    featured: false,
    id: '1',
  },
  {
    quote: 'Outstanding support and reliability. We could not be happier with our decision.',
    author: {
      name: 'Michael Chen',
      title: 'CTO',
      company: 'Digital Solutions',
      avatar: {
        imageType: 'external' as const,
        alt: 'Michael Chen',
        externalImage:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      },
    },
    rating: 5,
    featured: false,
    id: '2',
  },
  {
    quote: 'The best investment we have made for our business growth.',
    author: { name: 'Emily Davis', title: 'Marketing Director', company: 'Growth Agency' },
    rating: 5,
    featured: true,
    id: '3',
  },
];

const baseArgs = {
  title: 'What Our Clients Say',
  subtitle: 'Real feedback from real customers',
  testimonials: sampleTestimonials,
  showRatings: true,
  backgroundColor: 'none' as const,
  id: '1',
  blockName: 'TestimonialBlock',
  blockType: 'testimonialBlock' as const,
};

// ─── Layout variants ──────────────────────────────────────────────────────────

export const ThreeColumns: Story = {
  args: { ...baseArgs, layout: 'three-cols', style: 'card' },
};

export const TwoColumns: Story = {
  args: { ...baseArgs, layout: 'two-cols', style: 'card', id: '2' },
};

export const Single: Story = {
  args: { ...baseArgs, layout: 'single', style: 'quote', id: '3' },
};

export const Carousel: Story = {
  args: { ...baseArgs, layout: 'carousel', style: 'card', id: '4' },
};

export const Masonry: Story = {
  args: { ...baseArgs, layout: 'masonry', style: 'card', id: '5' },
};

// ─── Style variants ───────────────────────────────────────────────────────────

export const CardStyle: Story = {
  args: { ...baseArgs, layout: 'three-cols', style: 'card', id: '6' },
};

export const QuoteStyle: Story = {
  args: { ...baseArgs, layout: 'three-cols', style: 'quote', id: '7' },
};

export const MinimalStyle: Story = {
  args: { ...baseArgs, layout: 'three-cols', style: 'minimal', id: '8' },
};

export const BubbleStyle: Story = {
  args: { ...baseArgs, layout: 'three-cols', style: 'bubble', id: '9' },
};

// ─── Modifier variants ────────────────────────────────────────────────────────

export const NoRatings: Story = {
  args: { ...baseArgs, showRatings: false, id: '10' },
};

export const GrayBackground: Story = {
  args: { ...baseArgs, backgroundColor: 'light-gray', id: '11' },
};

export const DarkBackground: Story = {
  args: { ...baseArgs, backgroundColor: 'dark', id: '12' },
};
