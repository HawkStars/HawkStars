import type { Meta, StoryObj } from '@storybook/react';

import ReactMarkdownEditor from '../../../components/utils/ReactMarkdownEditor/ReactMarkdownEditor';

const meta: Meta<typeof ReactMarkdownEditor> = {
  component: ReactMarkdownEditor,
};

export default meta;
type Story = StoryObj<typeof ReactMarkdownEditor>;

export const Primary: Story = {
  args: {},
};
