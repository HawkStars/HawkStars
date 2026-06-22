import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AppProvider from '@/utils/contexts/AppProvider';
import SubmitProjectForm from './SubmitProjectForm';

// Note: on submit the form POSTs to `/api/member-projects`. In Storybook that
// request resolves to the error state, which is expected. All fields, the
// dynamic dates field-array and client-side validation are fully interactive.

const meta = {
  title: 'Misc/SubmitProjectForm',
  component: SubmitProjectForm,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    lng: { control: 'select', options: ['en', 'pt'] },
  },
  decorators: [
    (Story) => (
      <AppProvider lng='en'>
        <div className='bg-bege-light'>
          <Story />
        </div>
      </AppProvider>
    ),
  ],
} satisfies Meta<typeof SubmitProjectForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    lng: 'en',
  },
};

export const Portuguese: Story = {
  args: {
    lng: 'pt',
  },
  decorators: [
    (Story) => (
      <AppProvider lng='pt'>
        <div className='bg-bege-light'>
          <Story />
        </div>
      </AppProvider>
    ),
  ],
};
