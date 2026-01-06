import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FAQBlock } from './Component';

const meta: Meta<typeof FAQBlock> = {
  title: 'Extra/FAQBlock',
  component: FAQBlock,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof FAQBlock>;

export const Default: Story = {
  args: {
    title: 'Frequently Asked Questions',
    items: [
      {
        question: 'How can I become a member?',
        answer:
          'You can become a member by filling out our online application form and choosing your membership level. We offer various tiers to suit different levels of support.',
        id: '1',
      },
      {
        question: 'What programs do you offer for young people?',
        answer:
          'We offer leadership development workshops, skills training, mentorship programs, and community engagement activities. All programs are designed to empower young people aged 16-25.',
        id: '2',
      },
      {
        question: 'How can I volunteer?',
        answer:
          'We welcome volunteers! Visit our volunteer page to see current opportunities and submit an application. We provide full training and support for all volunteer roles.',
        id: '3',
      },
      {
        question: 'Where will the new building be located?',
        answer:
          'Our new community center will be located in central Lisbon, easily accessible by public transportation. The exact address will be announced once construction begins.',
        id: '4',
      },
    ],
    id: '1',
    blockName: 'FAQBlock',
    blockType: 'faq',
  },
};
