import Footer from '@/components/footer/Footer';
import AppProvider from '@/utils/contexts/AppProvider';
import type { Meta, StoryObj } from '@storybook/react';
import type { Footer as FooterType } from '@/payload-types';
import { createFooterLink, DUMMY_FOOTER_INFO } from './utils';

// Sample footer configurations
const simpleFooterInfo: FooterType = {
  id: 'simple-footer',
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

const fullFooterInfo: FooterType = {
  id: 'full-footer',
  columns: DUMMY_FOOTER_INFO.slice(0, 4),
};

const minimalFooterInfo: FooterType = {
  id: 'minimal-footer',
  columns: [
    {
      id: 'links-column',
      column: {
        title: 'Quick Links',
        data: [
          createFooterLink('Home', '/'),
          createFooterLink('About', '/about'),
          createFooterLink('Contact', '/contact'),
        ],
      },
    },
  ],
};

const emptyFooterInfo: FooterType = {
  id: 'empty-footer',
  columns: [],
};

const meta = {
  title: 'Navigation/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      return (
        <AppProvider footerInfo={simpleFooterInfo} lng='en'>
          <div className='bg-bege-light min-h-50'>
            <Story />
          </div>
        </AppProvider>
      );
    },
  ],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FullFooter: Story = {
  decorators: [
    (Story) => (
      <AppProvider footerInfo={fullFooterInfo} lng='en'>
        <div className='bg-bege-light min-h-50'>
          <Story />
        </div>
      </AppProvider>
    ),
  ],
};

export const MinimalFooter: Story = {
  decorators: [
    (Story) => (
      <AppProvider footerInfo={minimalFooterInfo} lng='en'>
        <div className='bg-bege-light min-h-50'>
          <Story />
        </div>
      </AppProvider>
    ),
  ],
};

export const MultiRowFooter: Story = {
  decorators: [
    (Story) => (
      <AppProvider footerInfo={{ id: 'multi-row-footer', columns: DUMMY_FOOTER_INFO }} lng='pt'>
        <div className='bg-bege-light min-h-50'>
          <Story />
        </div>
      </AppProvider>
    ),
  ],
};

export const EmptyFooter: Story = {
  decorators: [
    (Story) => (
      <AppProvider footerInfo={emptyFooterInfo} lng='en'>
        <div className='bg-bege-light min-h-50'>
          <Story />
        </div>
      </AppProvider>
    ),
  ],
};
