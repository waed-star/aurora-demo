import type { Meta, StoryObj } from "@storybook/react-vite";
import { Home, User, Search } from "lucide-react";
import { Nav } from "./Nav";

const defaultItems = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    ariaLabel: "Navigate to home",
  },
  {
    id: "profile",
    label: "Profile",
    icon: User,
    ariaLabel: "Navigate to profile",
  },
  {
    id: "search",
    label: "Search",
    icon: Search,
    ariaLabel: "Navigate to search",
  },
];

const meta = {
  title: "UI/Nav",
  component: Nav,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    selected: { control: "select", options: ["home", "profile", "search"] },
    defaultSelected: {
      control: "select",
      options: ["home", "profile", "search"],
    },
    onChange: { action: "changed" },
  },
  render: (args) => (
    <div className="w-full min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center bg-surface-muted">
        <p className="text-ink">Content area</p>
      </div>
      <Nav {...args} />
    </div>
  ),
} satisfies Meta<typeof Nav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: defaultItems,
    defaultSelected: "home",
  },
};

export const SelectedHome: Story = {
  args: {
    items: defaultItems,
    selected: "home",
  },
};

export const SelectedProfile: Story = {
  args: {
    items: defaultItems,
    selected: "profile",
  },
};

export const SelectedSearch: Story = {
  args: {
    items: defaultItems,
    selected: "search",
  },
};

export const WithDisabledItem: Story = {
  args: {
    items: [
      ...defaultItems.slice(0, 2),
      { ...defaultItems[2], disabled: true },
    ],
    defaultSelected: "home",
  },
};

export const MoreItems: Story = {
  args: {
    items: [
      {
        id: "home",
        label: "Home",
        icon: Home,
      },
      {
        id: "profile",
        label: "Profile",
        icon: User,
      },
      {
        id: "search",
        label: "Search",
        icon: Search,
      },
      {
        id: "settings",
        label: "Settings",
        icon: Search, // Placeholder icon
      },
    ],
    defaultSelected: "home",
  },
};

export const Controlled: Story = {
  args: {
    items: defaultItems,
    selected: "profile",
    onChange: (id) => console.log(`Selected: ${id}`),
  },
};
