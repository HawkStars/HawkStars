import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ArtPropertyComponent from './index';

const meta = {
  title: 'Pages/Art/Art Property',
  component: ArtPropertyComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
  },
} satisfies Meta<typeof ArtPropertyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Technique',
    value: 'Oil on canvas',
  },
};

export const NumericValue: Story = {
  args: {
    label: 'Year',
    value: 1923,
  },
};

export const Dimensions: Story = {
  args: {
    label: 'Dimensions',
    value: '120 × 90 cm',
  },
};

// When value is empty/null the component renders nothing.
export const EmptyValue: Story = {
  args: {
    label: 'Provenance',
    value: null,
  },
};
