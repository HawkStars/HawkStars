import type { Meta, StoryObj } from '@storybook/react';
import { GallerySliderBlock } from './Component';

const meta: Meta<typeof GallerySliderBlock> = {
  title: 'Payload Blocks/GallerySlider',
  component: GallerySliderBlock,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof GallerySliderBlock>;

const sampleImages = [
  {
    image: {
      id: '1',
      alt: 'Image 1',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
      filename: 'image1.jpg',
      mimeType: 'image/jpeg',
      filesize: 123456,
      width: 1200,
      height: 800,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    id: '1',
  },
  {
    image: {
      id: '2',
      alt: 'Image 2',
      url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=800&fit=crop',
      filename: 'image2.jpg',
      mimeType: 'image/jpeg',
      filesize: 123456,
      width: 1200,
      height: 800,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    id: '2',
  },
  {
    image: {
      id: '3',
      alt: 'Image 3',
      url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&h=800&fit=crop',
      filename: 'image3.jpg',
      mimeType: 'image/jpeg',
      filesize: 123456,
      width: 1200,
      height: 800,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    id: '3',
  },
];

export const Default: Story = {
  args: {
    images: sampleImages,
    autoplay: false,
    autoplayDelay: 3000,
    id: '1',
    blockName: 'GallerySlider',
    blockType: 'gallerySlider',
  },
};

export const WithAutoplay: Story = {
  args: {
    images: sampleImages,
    autoplay: true,
    autoplayDelay: 3000,
    id: '2',
    blockName: 'GallerySlider',
    blockType: 'gallerySlider',
  },
};

export const SlowAutoplay: Story = {
  args: {
    images: sampleImages,
    autoplay: true,
    autoplayDelay: 5000,
    id: '3',
    blockName: 'GallerySlider',
    blockType: 'gallerySlider',
  },
};
