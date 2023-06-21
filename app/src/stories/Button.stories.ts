import Button from "../components/utils/Button";
import type { Meta, StoryObj } from "@storybook/react";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Button> = {
  title: "Utils/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Button>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    type: "button",
    children: "Title",
  },
};

export const DisabledButton: Story = {
  args: {
    type: "button",
    children: "Button",
    disabled: true,
  },
};

export const LoadingButton: Story = {
  args: {
    type: "button",
    children: "Button",
    loading: true,
  },
};

export const RoundedButton: Story = {
  args: {
    children: "Button",
    rounded: "xl",
  },
};
