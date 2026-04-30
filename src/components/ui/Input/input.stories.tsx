import type { Meta }  from "@storybook/react-vite";
import { Input } from "./input";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "error"],
    },
  },
  render: (args) => <div className="flex w-full justify-center h-40 items-center"><Input {...args} /></div>,
};

export const Default = {
  args: {
    placeholder: "Default input",
    variant: "default",
  },
}

export default meta;