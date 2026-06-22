import FooterWrapper from '@/components/footer/FooterWrapper';
import AppProvider from '@/utils/contexts/AppProvider';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { Footer as FooterType } from '@/payload-types';
import { createFooterLink, DUMMY_FOOTER_INFO } from './utils';

// FooterWrapper dynamically (client-only) imports the Footer, which reads
// footerInfo from the AppProvider context.
const simpleFooterInfo: FooterType = {
  id: 'wrapper-simple-footer',
  columns: [
    {
      id: 'about-column',
      column: {
        title: 'About',
        data: [
          createFooterLink('Our Mission', '/about'),
          createFooterLink('Team', '/team'),
          createFooterLink('History', '/history'),
        ],
      },
    },
    {
      id: 'contact-column',
      column: {
        title: 'Contact',
        data: [createFooterLink('Contact Us', '/contact'), createFooterLink('Support', '/support')],
      },
    },
  ],
};

const meta = {
  title: 'Navigation/FooterWrapper',
  component: FooterWrapper,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <AppProvider footerInfo={simpleFooterInfo} lng='en'>
        <div className='bg-bege-light min-h-50'>
          <Story />
        </div>
      </AppProvider>
    ),
  ],
} satisfies Meta<typeof FooterWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FullFooter: Story = {
  decorators: [
    (Story) => (
      <AppProvider
        footerInfo={{ id: 'wrapper-full-footer', columns: DUMMY_FOOTER_INFO.slice(0, 4) }}
        lng='en'
      >
        <div className='bg-bege-light min-h-50'>
          <Story />
        </div>
      </AppProvider>
    ),
  ],
};
