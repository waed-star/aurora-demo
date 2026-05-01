import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";

const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      labels: { sm: "Small", md: "Medium", lg: "Large" },
    },
  },
  render: (args) => (
    <div className="flex w-full justify-center h-40 items-center">
      <Button {...args} />
    </div>
  ),
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { children: "Primary Button", variant: "primary", size: "md" },
};

export const Secondary: Story = {
  args: { children: "Secondary Button", variant: "secondary", size: "md" },
};

export const Tertiary: Story = {
  args: { children: "Tertiary Button", variant: "tertiary", size: "md" },
};

export const Disabled: Story = {
  args: { children: "Disabled", variant: "primary", size: "md", disabled: true },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4 justify-center h-40">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};
