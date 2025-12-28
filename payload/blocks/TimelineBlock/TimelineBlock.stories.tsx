import type { Meta, StoryObj } from '@storybook/react';
import { TimelineBlock } from './Component';

const meta: Meta<typeof TimelineBlock> = {
  title: 'Extra/TimelineBlock',
  component: TimelineBlock,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof TimelineBlock>;

const sampleItems = [
  {
    year: '2020',
    title: 'Foundation',
    description: 'Our organization was founded to support young people in the community.',
    id: '1',
  },
  {
    year: '2021',
    title: 'First Programs',
    description: 'Launched our first youth leadership and skills development programs.',
    id: '2',
  },
  {
    year: '2022',
    title: 'Community Expansion',
    description: 'Expanded our reach to serve 500+ young people across the region.',
    id: '3',
  },
  {
    year: '2023',
    title: 'Building Campaign',
    description: 'Started fundraising for our permanent community center.',
    id: '4',
  },
];

export const Vertical: Story = {
  args: {
    title: 'Our Journey',
    items: sampleItems,
    orientation: 'vertical',
    id: '1',
    blockName: 'TimelineBlock',
    blockType: 'timeline',
  },
};

export const Horizontal: Story = {
  args: {
    ...Vertical.args,
    orientation: 'horizontal',
  },
};
