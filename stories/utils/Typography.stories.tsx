import LanguageSwitcher from '@/components/utils/LanguageSwitcher';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const LOREM_STATIC_TEXT =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non lectus viverra, aliquet libero eget, bibendum ante. Curabitur diam arcu, consectetur id sollicitudin quis, sollicitudin.';

const meta: Meta<typeof LanguageSwitcher> = {
  title: 'Utils/Typography',
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
    <div className='flex flex-col items-center gap-4'>
      <span className='text-body'>Body Text</span>
      <span className='text-body'>{LOREM_STATIC_TEXT}</span>
      <span className='text-h1_semibold'>Heading Semibold</span>
      <span className='text-h1_semibold'>{LOREM_STATIC_TEXT}</span>
      <hr />
      <span className='text-h2_light'>Heading Light</span>
      <span className='text-h2_light'>{LOREM_STATIC_TEXT}</span>
      <hr />
      <span className='text-h2_bold'>Heading Bold</span>
      <span className='text-h2_bold'>{LOREM_STATIC_TEXT}</span>
      <hr />
      <span className='text-body_regular'>Body Regular</span>
      <span className='text-body_regular'>{LOREM_STATIC_TEXT}</span>
      <hr />
      <span className='text-body_semibold'>Body Semibold</span>
      <span className='text-body_semibold'>{LOREM_STATIC_TEXT}</span>
    </div>
  ),
};
