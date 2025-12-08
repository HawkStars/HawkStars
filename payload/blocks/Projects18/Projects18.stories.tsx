import type { Meta, StoryObj } from '@storybook/react';
import { Projects18Block } from './Component';
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical';
import { HawkProject } from '@/payload-types';

const meta: Meta<typeof Projects18Block> = {
  title: 'Payload Blocks/Projects18',
  component: Projects18Block,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Projects18Block>;

const sampleProjects = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    slug: 'ecommerce-platform',
    description: 'A modern e-commerce solution built with React and Node.js',
    featured: true,
    status: 'published',
    coverImage: {
      id: '1',
      alt: 'E-Commerce Platform',
      url: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop',
      filename: 'ecommerce.jpg',
      mimeType: 'image/jpeg',
      filesize: 123456,
      width: 800,
      height: 600,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Mobile Banking App',
    slug: 'mobile-banking',
    description: 'Secure and user-friendly mobile banking application',
    featured: true,
    status: 'published',
    coverImage: {
      id: '2',
      alt: 'Mobile Banking App',
      url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop',
      filename: 'banking.jpg',
      mimeType: 'image/jpeg',
      filesize: 123456,
      width: 800,
      height: 600,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Social Media Dashboard',
    slug: 'social-dashboard',
    description: 'Analytics dashboard for social media management',
    featured: false,
    status: 'published',
    coverImage: {
      id: '3',
      alt: 'Social Media Dashboard',
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      filename: 'dashboard.jpg',
      mimeType: 'image/jpeg',
      filesize: 123456,
      width: 800,
      height: 600,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const Default: Story = {
  args: {
    title: 'Our Projects',
    subtitle: 'Discover What We Have Built',
    description:
      'Explore our portfolio of successful projects and see how we help businesses grow.',
    projects: sampleProjects as unknown as (string | HawkProject)[],
    id: '1',
    blockName: 'Projects18',
    blockType: 'projects18',
  },
};

export const NoSubtitle: Story = {
  args: {
    title: 'Featured Work',
    description: 'A showcase of our best projects.',
    projects: sampleProjects.slice(0, 2) as unknown as (string | HawkProject)[],
    id: '2',
    blockName: 'Projects18',
    blockType: 'projects18',
  },
};

export const MinimalInfo: Story = {
  args: {
    title: 'Portfolio',
    projects: sampleProjects as unknown as (string | HawkProject)[],
    id: '3',
    blockName: 'Projects18',
    blockType: 'projects18',
  },
};
