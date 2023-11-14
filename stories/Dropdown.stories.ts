import Dropdown from "../components/utils/Dropdown";
import type { Meta, StoryObj } from "@storybook/react";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Dropdown> = {
  title: "Dropdown",
  component: Dropdown,
  tags: ["autodocs"],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const ButtonPrimary: Story = {
  args: {
    title: "Menu",
    options: [{ label: "Option 1" }, { label: "Option 2" }],
  },
};
