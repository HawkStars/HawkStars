import { AccordionBlock } from '@/payload/blocks/AccordionBlock/Component';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof AccordionBlock> = {
  title: 'Blocks/AccordionBlock',
  component: AccordionBlock,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'bordered', 'separated'],
    },
    allowMultiple: { control: 'boolean' },
    title: { control: 'text' },
    description: { control: 'text' },
    blockType: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleItems = [
  { title: 'What is your return policy?', content: 'We offer a 30-day return policy for all items purchased through our store. Items must be in their original condition with tags attached.', defaultOpen: false },
  { title: 'How long does shipping take?', content: 'Standard shipping typically takes 5-7 business days. Express shipping is available for 2-3 business days delivery.', defaultOpen: false },
  { title: 'Do you ship internationally?', content: 'Yes, we ship to over 50 countries worldwide. International shipping rates and delivery times vary by destination.', defaultOpen: false },
  { title: 'How can I track my order?', content: 'Once your order ships, you will receive an email with a tracking number. You can use this number to track your package on our website or the carrier website.', defaultOpen: false },
];

export const Default: Story = {
  args: {
    title: 'Frequently Asked Questions',
    description: 'Find answers to the most common questions about our services.',
    items: sampleItems,
    allowMultiple: false,
    variant: 'default',
    blockType: 'accordion',
  },
};

export const WithoutTitle: Story = {
  args: { items: sampleItems, allowMultiple: false, variant: 'default', blockType: 'accordion' },
};

export const Bordered: Story = {
  args: { title: 'Common Questions', items: sampleItems, allowMultiple: false, variant: 'bordered', blockType: 'accordion' },
};

export const Separated: Story = {
  args: { title: 'Help Center', description: 'Browse through our help topics below.', items: sampleItems, allowMultiple: false, variant: 'separated', blockType: 'accordion' },
};

export const MultipleOpen: Story = {
  args: { title: 'Product Information', items: sampleItems, allowMultiple: true, variant: 'default', blockType: 'accordion' },
};

export const WithDefaultOpen: Story = {
  args: { title: 'Getting Started', items: [{ ...sampleItems[0], defaultOpen: true }, ...sampleItems.slice(1)], allowMultiple: false, variant: 'bordered', blockType: 'accordion' },
};

export const LongContent: Story = {
  args: {
    title: 'Detailed Information',
    items: [
      { title: 'Terms and Conditions', content: `By accessing and using our website, you agree to be bound by these terms and conditions.\n\nPlease read them carefully before proceeding. We reserve the right to modify these terms at any time without prior notice.\n\nAll content on this website is protected by copyright and may not be reproduced without our express written permission.`, defaultOpen: true },
      { title: 'Privacy Policy', content: `We take your privacy seriously. This policy describes how we collect, use, and protect your personal information.\n\nWe collect information you provide directly, such as when you create an account, make a purchase, or contact us for support.\n\nYour data is stored securely and we never sell your personal information to third parties.`, defaultOpen: false },
    ],
    allowMultiple: false,
    variant: 'bordered',
    blockType: 'accordion',
  },
};

export const SingleItem: Story = {
  args: {
    title: 'Need Help?',
    items: [{ title: 'Contact our support team', content: 'Our support team is available 24/7 to help you with any questions or concerns. Reach us via email at support@example.com or call us at 1-800-123-4567.', defaultOpen: false }],
    allowMultiple: false,
    variant: 'separated',
    blockType: 'accordion',
  },
};

export const TitleOnly: Story = {
  args: { title: 'Quick FAQ', items: sampleItems.slice(0, 2), allowMultiple: false, variant: 'default', blockType: 'accordion' },
};
