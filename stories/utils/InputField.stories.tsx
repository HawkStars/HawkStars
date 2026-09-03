import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { LuSearch } from 'react-icons/lu';

import Input, { InputProps } from '@/components/utils/Input/Input';

// This is the form-facing field used across the site's forms (contribute,
// members-corner) -- distinct from the raw `components/ui/input` primitive
// documented under "Design System/Input". It always wraps a label, optional
// hint/error text, and renders as a controlled input.
const meta = {
  title: 'Design System/Input Field',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
    },
    outline: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// `Input` always renders `value={value || ''}`, so it's controlled even when
// no value is passed in -- wrap it in local state to avoid a
// "changing an uncontrolled input" warning and to demo typing.
const InteractiveInput = (props: InputProps) => {
  const [value, setValue] = useState(props.value ?? '');
  return (
    <div className='w-72'>
      <Input {...props} value={value} onChange={(e) => setValue(e.target.value)} />
    </div>
  );
};

export const Default: Story = {
  render: () => (
    <InteractiveInput name='email' labelText='Email address' placeholder='you@example.com' />
  ),
};

export const WithHint: Story = {
  render: () => (
    <InteractiveInput
      name='phone'
      labelText='Phone number'
      placeholder='+351 900 000 000'
      inputHintText="We'll only use this to contact you about your donation."
    />
  ),
};

export const WithError: Story = {
  render: () => (
    <InteractiveInput
      name='email'
      labelText='Email address'
      placeholder='you@example.com'
      errorMessage='Please enter a valid email address.'
    />
  ),
};

export const Disabled: Story = {
  render: () => (
    <InteractiveInput name='email' labelText='Email address' placeholder='Disabled' disabled />
  ),
};

export const WithIcon: Story = {
  render: () => (
    <InteractiveInput
      name='search'
      labelText='Search'
      placeholder='Search…'
      icon={<LuSearch />}
    />
  ),
};

export const Outline: Story = {
  render: () => <InteractiveInput name='name' labelText='Name' placeholder='Your name' outline />,
};
