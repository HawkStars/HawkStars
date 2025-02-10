import ReactMarkdownViewer from '@/components/utils/ReactMarkdownViewer/ReactMarkdownViewer';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ReactMarkdownViewer> = {
  component: ReactMarkdownViewer,
};

export default meta;
type Story = StoryObj<typeof ReactMarkdownViewer>;

export const Primary: Story = {
  args: {
    source: `# Hello World \n ## Hello World \n ### Hello World \n **testing**`,
  },
};
