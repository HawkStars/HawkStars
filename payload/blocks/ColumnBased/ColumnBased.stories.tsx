import type { Meta, StoryObj } from '@storybook/react';
import { ColumnBasedBlock } from './Component';

const meta: Meta<typeof ColumnBasedBlock> = {
  title: 'Structure/ColumnBased',
  component: ColumnBasedBlock,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof ColumnBasedBlock>;

export const TwoColumns: Story = {
  args: {
    columns: [
      {
        icon: 'User',
        title: 'User Management',
        subtitle: 'Manage your users efficiently',
        list: [
          { item: 'User roles and permissions', id: '1' },
          { item: 'User profiles and settings', id: '2' },
          { item: 'Activity tracking', id: '3' },
        ],
        id: '1',
      },
      {
        icon: 'Mail',
        title: 'Email Integration',
        subtitle: 'Connect with your favorite email service',
        list: [
          { item: 'SMTP configuration', id: '1' },
          { item: 'Email templates', id: '2' },
          { item: 'Automated campaigns', id: '3' },
        ],
        id: '2',
      },
    ],
    id: '1',
    blockName: 'ColumnBased',
    blockType: 'columnBased',
  },
};

export const ThreeColumns: Story = {
  args: {
    columns: [
      {
        icon: 'Calendar',
        title: 'Scheduling',
        subtitle: 'Plan your events',
        list: [
          { item: 'Calendar view', id: '1' },
          { item: 'Recurring events', id: '2' },
        ],
        id: '1',
      },
      {
        icon: 'Bell',
        title: 'Notifications',
        subtitle: 'Stay updated',
        list: [
          { item: 'Real-time alerts', id: '1' },
          { item: 'Email notifications', id: '2' },
        ],
        id: '2',
      },
      {
        icon: 'Shield',
        title: 'Security',
        subtitle: 'Enterprise-grade security',
        list: [
          { item: 'Two-factor authentication', id: '1' },
          { item: 'Data encryption', id: '2' },
        ],
        id: '3',
      },
    ],
    id: '2',
    blockName: 'ColumnBased',
    blockType: 'columnBased',
  },
};

export const NoIcons: Story = {
  args: {
    columns: [
      {
        title: 'Feature One',
        subtitle: 'Description of feature one',
        list: [
          { item: 'Benefit 1', id: '1' },
          { item: 'Benefit 2', id: '2' },
        ],
        id: '1',
      },
      {
        title: 'Feature Two',
        subtitle: 'Description of feature two',
        list: [
          { item: 'Benefit 1', id: '1' },
          { item: 'Benefit 2', id: '2' },
        ],
        id: '2',
      },
    ],
    id: '3',
    blockName: 'ColumnBased',
    blockType: 'columnBased',
  },
};
