import type { Meta, StoryObj } from '@storybook/react';
import { FeatureComparisonBlock } from './Component';

const meta: Meta<typeof FeatureComparisonBlock> = {
  title: 'Extra/FeatureComparisonBlock',
  component: FeatureComparisonBlock,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof FeatureComparisonBlock>;

export const Default: Story = {
  args: {
    title: 'Membership Tiers Comparison',
    columns: [
      { name: 'Friend', highlighted: false, id: '1' },
      { name: 'Supporter', highlighted: true, id: '2' },
      { name: 'Champion', highlighted: false, id: '3' },
    ],
    features: [
      { feature: 'Monthly Newsletter', column1: true, column2: true, column3: true, id: '1' },
      { feature: 'Event Discounts', column1: true, column2: true, column3: true, id: '2' },
      { feature: 'Quarterly Reports', column1: false, column2: true, column3: true, id: '3' },
      { feature: 'Free Event Entry', column1: false, column2: false, column3: true, id: '4' },
      { feature: 'Advisory Board Access', column1: false, column2: false, column3: true, id: '5' },
    ],
    id: '1',
    blockName: 'FeatureComparisonBlock',
    blockType: 'featureComparison',
  },
};
