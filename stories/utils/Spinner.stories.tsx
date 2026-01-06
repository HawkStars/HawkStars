import Spinner from '@/components/utils/Spinner/Spinner';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof Spinner> = {
  title: 'Utils/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  tags: [],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className='flex items-center gap-8'>
      <div className='flex flex-col items-center gap-2'>
        <Spinner />
      </div>
    </div>
  ),
};
