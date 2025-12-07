import type { Meta, StoryObj } from '@storybook/react';
import { UpdatesBlock } from './Component';

const meta: Meta<typeof UpdatesBlock> = {
  title: 'Payload Blocks/UpdatesBlock',
  component: UpdatesBlock,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof UpdatesBlock>;

export const Default: Story = {
  args: {
    heading: 'Resources & Whitepapers',
    description: 'Explore our thoughts, case studies, and the latest trends in technology.',
    categories: [
      { name: 'Data', id: '1' },
      { name: 'AI', id: '2' },
      { name: 'Security', id: '3' },
      { name: 'News', id: '4' },
    ],
    latestUpdates: [
      {
        title: 'Understanding Modern Data Architecture',
        category: 'Data',
        date: 'Dec 6, 2024',
        authors: [
          { avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop', id: '1' },
          { avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop', id: '2' },
        ],
        link: '/blog/data-architecture',
        id: '1',
      },
      {
        title: 'AI-Powered Analytics: The Future',
        category: 'AI',
        date: 'Dec 5, 2024',
        authors: [
          { avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop', id: '1' },
        ],
        link: '/blog/ai-analytics',
        id: '2',
      },
      {
        title: 'Security Best Practices for 2025',
        category: 'Security',
        date: 'Dec 4, 2024',
        authors: [
          { avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop', id: '1' },
        ],
        link: '/blog/security-2025',
        id: '3',
      },
      {
        title: 'Product Launch: New Features',
        category: 'News',
        date: 'Dec 3, 2024',
        authors: [
          { avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop', id: '1' },
          { avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop', id: '2' },
        ],
        link: '/blog/product-launch',
        id: '4',
      },
    ],
    id: '1',
    blockName: 'UpdatesBlock',
    blockType: 'updatesBlock',
  },
};

export const MinimalCategories: Story = {
  args: {
    heading: 'Latest Blog Posts',
    description: 'Stay updated with our latest thoughts and articles.',
    categories: [
      { name: 'All', id: '1' },
      { name: 'Tech', id: '2' },
    ],
    latestUpdates: [
      {
        title: 'Getting Started with Next.js',
        category: 'Tech',
        date: 'Dec 7, 2024',
        authors: [
          { avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop', id: '1' },
        ],
        link: '/blog/nextjs-guide',
        id: '1',
      },
      {
        title: 'Web Performance Optimization',
        category: 'Tech',
        date: 'Dec 6, 2024',
        authors: [
          { avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop', id: '1' },
        ],
        link: '/blog/web-performance',
        id: '2',
      },
    ],
    id: '2',
    blockName: 'UpdatesBlock',
    blockType: 'updatesBlock',
  },
};

export const NoDescription: Story = {
  args: {
    heading: 'News & Updates',
    categories: [
      { name: 'Company', id: '1' },
      { name: 'Product', id: '2' },
    ],
    latestUpdates: [
      {
        title: 'Company Milestone Reached',
        category: 'Company',
        date: 'Dec 5, 2024',
        authors: [
          { avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop', id: '1' },
        ],
        link: '/news/milestone',
        id: '1',
      },
    ],
    id: '3',
    blockName: 'UpdatesBlock',
    blockType: 'updatesBlock',
  },
};
