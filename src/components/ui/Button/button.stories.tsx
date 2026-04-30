import type { Meta }  from "@storybook/react-vite";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary"],
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
  },
  render: (args) => <div className="flex w-full justify-center h-40 items-center"><Button {...args} /></div>,
};

export const Primary = {
  args: {
    children: "Primary Button",
    variant: "primary",
    size: "medium",
  },
}

export const PrimaryDisabled = {
  args: {
    children: "Primary Button",
    variant: "primary",
    size: "medium",
    disabled: true,
  },
}

export const Secondary = {
  args: {
    children: "Secondary Button",
    variant: "secondary",
    size: "medium",
  },
}

export default meta;