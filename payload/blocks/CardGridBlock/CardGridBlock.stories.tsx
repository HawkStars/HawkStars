import type { Meta, StoryObj } from '@storybook/react';
import { CardGridBlock } from './Component';

const meta: Meta<typeof CardGridBlock> = {
  title: 'Payload Blocks/CardGridBlock',
  component: CardGridBlock,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof CardGridBlock>;

export const Default: Story = {
  args: {
    title: 'Our Features',
    features: [
      {
        heading: 'Pull Requests',
        description: 'Collaborate on code with built-in review tools.',
        icon: 'GitPullRequest',
        id: '1',
      },
      {
        heading: 'Project Boards',
        description: 'Organize and prioritize your work with flexible boards.',
        icon: 'SquareKanban',
        id: '2',
      },
      {
        heading: 'CI/CD',
        description: 'Automate your workflow from code to deployment.',
        icon: 'RadioTower',
        id: '3',
      },
      {
        heading: 'AI-Powered',
        description: 'Get intelligent code suggestions and automate tasks.',
        icon: 'WandSparkles',
        id: '4',
      },
      {
        heading: 'Multi-Layer Security',
        description: 'Keep your code safe with advanced security features.',
        icon: 'Layers',
        id: '5',
      },
      {
        heading: 'Fast Performance',
        description: 'Experience lightning-fast load times and responsiveness.',
        icon: 'BatteryCharging',
        id: '6',
      },
    ],
    buttonText: 'Learn More',
    buttonUrl: '/features',
    id: '1',
    blockName: 'CardGridBlock',
    blockType: 'cardGridBlock',
  },
};

export const NoTitle: Story = {
  args: {
    features: [
      {
        heading: 'Easy Setup',
        description: 'Get started in minutes with our simple setup process.',
        icon: 'GitPullRequest',
        id: '1',
      },
      {
        heading: 'Great Support',
        description: '24/7 customer support to help you succeed.',
        icon: 'SquareKanban',
        id: '2',
      },
      {
        heading: 'Scalable',
        description: 'Grow from startup to enterprise without limits.',
        icon: 'RadioTower',
        id: '3',
      },
    ],
    id: '2',
    blockName: 'CardGridBlock',
    blockType: 'cardGridBlock',
  },
};

export const WithButton: Story = {
  args: {
    title: 'Why Choose Us',
    features: [
      {
        heading: 'Reliable',
        description: '99.9% uptime guarantee for your peace of mind.',
        icon: 'Layers',
        id: '1',
      },
      {
        heading: 'Flexible',
        description: 'Adapt to your needs with customizable options.',
        icon: 'WandSparkles',
        id: '2',
      },
    ],
    buttonText: 'Get Started',
    buttonUrl: '/signup',
    id: '3',
    blockName: 'CardGridBlock',
    blockType: 'cardGridBlock',
  },
};
