import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LuBold, LuItalic, LuUnderline } from 'react-icons/lu';

import { Button } from '@/components/ui/button';
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from '@/components/ui/button-group';
import { Input } from '@/components/ui/input';

const meta = {
  title: 'Design System/Button Group',
  component: ButtonGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: { type: 'inline-radio' },
      options: ['horizontal', 'vertical'],
    },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant='outline'>Left</Button>
      <Button variant='outline'>Middle</Button>
      <Button variant='outline'>Right</Button>
    </ButtonGroup>
  ),
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant='outline'>Top</Button>
      <Button variant='outline'>Middle</Button>
      <Button variant='outline'>Bottom</Button>
    </ButtonGroup>
  ),
};

export const IconButtons: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant='outline' size='icon' aria-label='Bold'>
        <LuBold />
      </Button>
      <Button variant='outline' size='icon' aria-label='Italic'>
        <LuItalic />
      </Button>
      <Button variant='outline' size='icon' aria-label='Underline'>
        <LuUnderline />
      </Button>
    </ButtonGroup>
  ),
};

export const WithSeparator: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant='outline'>Save</Button>
      <ButtonGroupSeparator />
      <Button variant='outline'>Discard</Button>
    </ButtonGroup>
  ),
};

export const WithText: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupText>https://</ButtonGroupText>
      <Input placeholder='hawkstars.org' />
      <Button variant='outline'>Go</Button>
    </ButtonGroup>
  ),
};
