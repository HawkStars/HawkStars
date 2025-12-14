import type { Meta, StoryObj } from '@storybook/react';
import { TeamGridBlock } from './Component';

const meta: Meta<typeof TeamGridBlock> = {
  title: 'Payload Blocks/TeamGridBlock',
  component: TeamGridBlock,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof TeamGridBlock>;

const sampleMembers = [
  {
    name: 'Ana Silva',
    role: 'Executive Director',
    bio: 'Passionate about empowering young people through education and community building.',
    email: 'ana@example.com',
    linkedIn: 'https://linkedin.com',
    photo: {
      url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      alt: 'Ana Silva',
    },
    id: '1',
  },
  {
    name: 'João Costa',
    role: 'Program Manager',
    bio: 'Dedicated to creating meaningful experiences for youth in our community.',
    email: 'joao@example.com',
    twitter: 'https://twitter.com',
    photo: {
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      alt: 'João Costa',
    },
    id: '2',
  },
  {
    name: 'Maria Santos',
    role: 'Fundraising Coordinator',
    bio: 'Building partnerships to support our mission and expand our impact.',
    email: 'maria@example.com',
    linkedIn: 'https://linkedin.com',
    photo: {
      url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      alt: 'Maria Santos',
    },
    id: '3',
  },
];

export const Default: Story = {
  args: {
    title: 'Our Team',
    subtitle: 'Meet the dedicated individuals working to make a difference in our community',
    members: sampleMembers,
    layout: 'cols-3',
    id: '1',
    blockName: 'TeamGridBlock',
    blockType: 'teamGrid',
  },
};

export const TwoColumns: Story = {
  args: {
    ...Default.args,
    layout: 'cols-2',
  },
};

export const FourColumns: Story = {
  args: {
    ...Default.args,
    layout: 'cols-4',
    members: [
      ...sampleMembers,
      {
        name: 'Pedro Oliveira',
        role: 'Volunteer Coordinator',
        email: 'pedro@example.com',
        id: '4',
      },
    ],
  },
};
