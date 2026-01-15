import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { StatsBlock } from './Component';
import { StatsBlock as StatsBlockType } from '@/payload-types';

const meta: Meta<typeof StatsBlock> = {
  title: 'Blocks/StatsBlock',
  component: StatsBlock,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    columns: {
      control: 'select',
      options: ['2', '3', '4', '5'],
    },
    background: {
      control: 'select',
      options: ['white', 'bege', 'green'],
    },
    hoverBorderColor: {
      control: 'select',
      options: ['green', 'bege'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof StatsBlock>;

const sampleStats = [
  {
    icon: 'Users' as unknown as StatsBlockType['stats'][0]['icon'],
    iconAlign: 'center' as const,
    title: '10,000+',
    titleAlign: 'center' as const,
    description: 'Active Members',
    id: '1',
  },
  {
    icon: 'Calendar' as unknown as StatsBlockType['stats'][0]['icon'],
    iconAlign: 'center' as const,
    title: '500+',
    titleAlign: 'center' as const,
    description: 'Events Organized',
    id: '2',
  },
  {
    icon: 'Globe' as unknown as StatsBlockType['stats'][0]['icon'],
    iconAlign: 'center' as const,
    title: '25',
    titleAlign: 'center' as const,
    description: 'Countries Reached',
    id: '3',
  },
  {
    icon: 'Heart' as unknown as StatsBlockType['stats'][0]['icon'],
    iconAlign: 'center' as const,
    title: '€1M+',
    titleAlign: 'center' as const,
    description: 'Funds Raised',
    id: '4',
  },
];

const sampleLinks = [
  {
    link: {
      type: 'custom' as const,
      url: '/contribute',
      label: 'Get Involved',
    },
  },
  {
    link: {
      type: 'custom' as const,
      url: '/about',
      label: 'Learn More',
    },
  },
];

export const ThreeColumns: Story = {
  args: {
    columns: '3',
    background: 'white',
    hoverBorderColor: 'green',
    stats: sampleStats.slice(0, 3),
    id: '1',
    blockName: 'StatsBlock',
    blockType: 'statsBlock',
  },
};

export const FourColumns: Story = {
  args: {
    ...ThreeColumns.args,
    columns: '4',
    stats: sampleStats,
  },
};

export const TwoColumns: Story = {
  args: {
    ...ThreeColumns.args,
    columns: '2',
    stats: sampleStats.slice(0, 2),
  },
};

export const FiveColumns: Story = {
  args: {
    ...ThreeColumns.args,
    columns: '5',
    stats: [
      ...sampleStats,
      {
        icon: 'Award' as unknown as keyof StatsBlockType['stats'][0]['icon'],
        title: '50+',
        description: 'Awards Won',
        id: '5',
      },
      {
        description:
          'Very long description example to test text wrapping in the stat card layout add more and more text here just to test the length',
      },
    ],
  },
};

export const BegeBackground: Story = {
  args: {
    ...ThreeColumns.args,
    background: 'bege',
    stats: sampleStats.slice(0, 3),
  },
};

export const GreenBackground: Story = {
  args: {
    ...ThreeColumns.args,
    background: 'green',
    stats: sampleStats.slice(0, 3),
  },
};

export const BegeHoverBorder: Story = {
  args: {
    ...ThreeColumns.args,
    hoverBorderColor: 'bege',
    stats: sampleStats.slice(0, 3),
  },
};

export const WithCTAButtons: Story = {
  args: {
    ...ThreeColumns.args,
    stats: sampleStats.slice(0, 3),
    links: sampleLinks,
  },
};

export const MinimalWithoutIcons: Story = {
  args: {
    ...ThreeColumns.args,
    stats: [
      { title: '500+', description: 'Projects Completed', id: '1' },
      { title: '98%', description: 'Client Satisfaction', id: '2' },
      { title: '24/7', description: 'Support Available', id: '3' },
    ],
  },
};

export const TitlesOnly: Story = {
  args: {
    ...ThreeColumns.args,
    columns: '4',
    stats: [
      { icon: 'Zap', title: 'Fast', id: '1' },
      { icon: 'Shield', title: 'Secure', id: '2' },
      { icon: 'Sparkles', title: 'Innovative', id: '3' },
      { icon: 'Rocket', title: 'Scalable', id: '4' },
    ],
  },
};

export const LeftAligned: Story = {
  args: {
    ...ThreeColumns.args,
    stats: [
      {
        icon: 'Users' as unknown as StatsBlockType['stats'][0]['icon'],
        iconAlign: 'left' as const,
        title: '10,000+',
        titleAlign: 'left' as const,
        description: 'Active Members',
        id: '1',
      },
      {
        icon: 'Calendar' as unknown as StatsBlockType['stats'][0]['icon'],
        iconAlign: 'left' as const,
        title: '500+',
        titleAlign: 'left' as const,
        description: 'Events Organized',
        id: '2',
      },
      {
        icon: 'Globe' as unknown as StatsBlockType['stats'][0]['icon'],
        iconAlign: 'left' as const,
        title: '25',
        titleAlign: 'left' as const,
        description: 'Countries Reached',
        id: '3',
      },
    ],
  },
};

export const RightAligned: Story = {
  args: {
    ...ThreeColumns.args,
    stats: [
      {
        icon: 'Users' as unknown as StatsBlockType['stats'][0]['icon'],
        iconAlign: 'right' as const,
        title: '10,000+',
        titleAlign: 'right' as const,
        description: 'Active Members',
        id: '1',
      },
      {
        icon: 'Calendar' as unknown as StatsBlockType['stats'][0]['icon'],
        iconAlign: 'right' as const,
        title: '500+',
        titleAlign: 'right' as const,
        description: 'Events Organized',
        id: '2',
      },
      {
        icon: 'Globe' as unknown as StatsBlockType['stats'][0]['icon'],
        iconAlign: 'right' as const,
        title: '25',
        titleAlign: 'right' as const,
        description: 'Countries Reached',
        id: '3',
      },
    ],
  },
};

export const MixedAlignment: Story = {
  args: {
    ...ThreeColumns.args,
    stats: [
      {
        icon: 'Users' as unknown as StatsBlockType['stats'][0]['icon'],
        iconAlign: 'left' as const,
        title: '10,000+',
        titleAlign: 'center' as const,
        description: 'Active Members',
        id: '1',
      },
      {
        icon: 'Calendar' as unknown as StatsBlockType['stats'][0]['icon'],
        iconAlign: 'center' as const,
        title: '500+',
        titleAlign: 'left' as const,
        description: 'Events Organized',
        id: '2',
      },
      {
        icon: 'Globe' as unknown as StatsBlockType['stats'][0]['icon'],
        iconAlign: 'right' as const,
        title: '25',
        titleAlign: 'right' as const,
        description: 'Countries Reached',
        id: '3',
      },
    ],
  },
};

export const LongDescriptions: Story = {
  args: {
    ...ThreeColumns.args,
    columns: '3',
    stats: [
      {
        icon: 'Users' as unknown as StatsBlockType['stats'][0]['icon'],
        iconAlign: 'center' as const,
        title: '10,000+',
        titleAlign: 'center' as const,
        description:
          'Active members from around the world who participate in our community programs, volunteer initiatives, and cultural exchange events throughout the year.',
        descriptionAlign: 'center' as const,
        id: '1',
      },
      {
        icon: 'Calendar' as unknown as StatsBlockType['stats'][0]['icon'],
        iconAlign: 'left' as const,
        title: '500+',
        titleAlign: 'left' as const,
        description:
          'Events organized including workshops, seminars, conferences, cultural festivals, networking sessions, and educational programs that bring people together.',
        descriptionAlign: 'left' as const,
        id: '2',
      },
      {
        icon: 'Globe' as unknown as StatsBlockType['stats'][0]['icon'],
        iconAlign: 'right' as const,
        title: '25',
        titleAlign: 'right' as const,
        description:
          'Countries reached across Europe, Africa, Asia, and the Americas, building bridges between diverse cultures and fostering international collaboration and understanding.',
        descriptionAlign: 'right' as const,
        id: '3',
      },
    ],
  },
};
