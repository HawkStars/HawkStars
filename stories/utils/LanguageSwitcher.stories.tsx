import LanguageSwitcher from '@/components/utils/LanguageSwitcher';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof LanguageSwitcher> = {
  title: 'Utils/LanguageSwitcher',
  component: LanguageSwitcher,
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
      router: {
        basePath: '/',
      },
    },
  },
  tags: [],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className='flex items-center gap-8'>
      <div className='flex flex-col items-center gap-2'>
        <LanguageSwitcher />
      </div>
    </div>
  ),
};
