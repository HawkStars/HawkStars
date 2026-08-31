import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const meta = {
  title: 'Design System/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className='w-56' aria-label='Select a fruit'>
        <SelectValue placeholder='Select a fruit' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='apple'>Apple</SelectItem>
        <SelectItem value='banana'>Banana</SelectItem>
        <SelectItem value='orange'>Orange</SelectItem>
        <SelectItem value='grape'>Grape</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className='w-56' aria-label='Select a timezone'>
        <SelectValue placeholder='Select a timezone' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value='lisbon'>Lisbon</SelectItem>
          <SelectItem value='london'>London</SelectItem>
          <SelectItem value='berlin'>Berlin</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>America</SelectLabel>
          <SelectItem value='new-york'>New York</SelectItem>
          <SelectItem value='sao-paulo'>São Paulo</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const WithDisabledItem: Story = {
  render: () => (
    <Select>
      <SelectTrigger className='w-56' aria-label='Select a plan'>
        <SelectValue placeholder='Select a plan' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='free'>Free</SelectItem>
        <SelectItem value='pro'>Pro</SelectItem>
        <SelectItem value='enterprise' disabled>
          Enterprise (coming soon)
        </SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className='w-56' aria-label='Disabled select'>
        <SelectValue placeholder='Disabled select' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='one'>One</SelectItem>
      </SelectContent>
    </Select>
  ),
};
