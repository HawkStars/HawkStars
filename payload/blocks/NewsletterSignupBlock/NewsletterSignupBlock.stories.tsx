import type { Meta, StoryObj } from '@storybook/react';
import { NewsletterSignupBlock } from './Component';

const meta: Meta<typeof NewsletterSignupBlock> = {
  title: 'Extra/NewsletterSignupBlock',
  component: NewsletterSignupBlock,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof NewsletterSignupBlock>;

export const Light: Story = {
  args: {
    title: 'Stay Updated',
    description:
      'Get the latest news and updates about our programs and events delivered to your inbox.',
    buttonText: 'Subscribe',
    id: '1',
    blockName: 'NewsletterSignupBlock',
    blockType: 'newsletterSignup',
  },
};
