import type { Meta, StoryObj } from '@storybook/react';
import { TestimonialBlock } from './Component';

const meta: Meta<typeof TestimonialBlock> = {
  title: 'Payload Blocks/TestimonialBlock',
  component: TestimonialBlock,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    layout: {
      control: 'select',
      options: ['single', 'two-cols', 'three-cols', 'carousel', 'masonry'],
    },
    style: {
      control: 'select',
      options: ['card', 'quote', 'minimal', 'bubble'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof TestimonialBlock>;

export const Default: Story = {
  args: {
    title: 'What Our Clients Say',
    subtitle: 'Real feedback from real customers',
    testimonials: [
      {
        quote:
          'This platform has transformed the way we work. The features are intuitive and powerful.',
        author: {
          name: 'Sarah Johnson',
          title: 'CEO',
          company: 'Tech Innovations Inc.',
          avatar: {
            id: '1',
            alt: 'Sarah Johnson',
            url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
            filename: 'avatar1.jpg',
            mimeType: 'image/jpeg',
            filesize: 5000,
            width: 100,
            height: 100,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
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
            id: '2',
            alt: 'Michael Chen',
            url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
            filename: 'avatar2.jpg',
            mimeType: 'image/jpeg',
            filesize: 5000,
            width: 100,
            height: 100,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
        rating: 5,
        featured: false,
        id: '2',
      },
      {
        quote: 'The best investment we have made for our business growth.',
        author: {
          name: 'Emily Davis',
          title: 'Marketing Director',
          company: 'Growth Agency',
        },
        rating: 5,
        featured: true,
        id: '3',
      },
    ],
    layout: 'three-cols',
    style: 'card',
    showRatings: true,
    backgroundColor: 'none',
    id: '1',
    blockName: 'TestimonialBlock',
    blockType: 'testimonialBlock',
  },
};

export const CardStyle: Story = {
  args: {
    ...Default.args,
    style: 'card',
    id: '2',
  },
};

export const QuoteStyle: Story = {
  args: {
    ...Default.args,
    style: 'quote',
    id: '3',
  },
};

export const TwoColumns: Story = {
  args: {
    ...Default.args,
    layout: 'two-cols',
    id: '4',
  },
};

export const NoRatings: Story = {
  args: {
    ...Default.args,
    showRatings: false,
    id: '5',
  },
};
