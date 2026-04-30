import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToggleGroup, ToggleGroupItem } from "./toggleGroup";

const meta = {
  title: "UI/ToggleGroup",
  component: ToggleGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="option1">
      <ToggleGroupItem value="option1">Option 1</ToggleGroupItem>
      <ToggleGroupItem value="option2">Option 2</ToggleGroupItem>
      <ToggleGroupItem value="option3">Option 3</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Multiple: Story = {
  render: () => (
    <ToggleGroup type="multiple" defaultValue={["option1", "option2"]}>
      <ToggleGroupItem value="option1">Bold</ToggleGroupItem>
      <ToggleGroupItem value="option2">Italic</ToggleGroupItem>
      <ToggleGroupItem value="option3">Underline</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="option1" disabled>
      <ToggleGroupItem value="option1">Option 1</ToggleGroupItem>
      <ToggleGroupItem value="option2">Option 2</ToggleGroupItem>
      <ToggleGroupItem value="option3">Option 3</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const WithDisabledItem: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="option1">
      <ToggleGroupItem value="option1">Option 1</ToggleGroupItem>
      <ToggleGroupItem value="option2" disabled>
        Option 2 (Disabled)
      </ToggleGroupItem>
      <ToggleGroupItem value="option3">Option 3</ToggleGroupItem>
    </ToggleGroup>
  ),
};
