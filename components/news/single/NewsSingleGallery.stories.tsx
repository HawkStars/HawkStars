import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MultiImageType } from '@/payload-types';
import NewsSingleGallery from './NewsSingleGallery';

const galleryWithExternal: MultiImageType = {
  externalImages: [
    {
      url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&h=400&fit=crop',
      alt: 'Stage lights',
    },
    {
      url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop',
      alt: 'Concert crowd',
    },
    {
      url: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600&h=400&fit=crop',
      alt: 'Festival tents',
    },
    {
      url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=400&fit=crop',
      alt: 'Live performance',
    },
  ],
};

const galleryWithInternal = {
  internalImages: [
    {
      id: 'i1',
      image: {
        id: 'm1',
        url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=400&fit=crop',
        alt: 'Workshop',
        width: 600,
        height: 400,
      },
    },
    {
      id: 'i2',
      image: {
        id: 'm2',
        url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop',
        alt: 'Group photo',
        width: 600,
        height: 400,
      },
    },
  ],
} as unknown as MultiImageType;

const meta = {
  title: 'News/NewsSingleGallery',
  component: NewsSingleGallery,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NewsSingleGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    gallery: galleryWithExternal,
  },
};

export const InternalImages: Story = {
  args: {
    gallery: galleryWithInternal,
  },
};

export const Empty: Story = {
  args: {
    gallery: { externalImages: [], internalImages: [] },
  },
};
