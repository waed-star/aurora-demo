import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, useEffect } from "react";
import { NavBar } from "./NavBar";
import type { NavItemId } from "./NavBar.types";

// Simple icon placeholders for stories
const HomeIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const SearchIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const ProfileIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const meta = {
  title: "UI/NavBar",
  component: NavBar,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    selected: {
      control: "select",
      options: ["home", "search", "profile"],
    },
    onSelect: { action: "onSelect" },
  },
} satisfies Meta<typeof NavBar>;

export default meta;
type Story = StoryObj<typeof meta>;

function ControlledNavBar(args: any) {
  const [selected, setSelected] = useState<NavItemId>(args.selected || "home");

  // Update internal state when args change
  useEffect(() => {
    setSelected(args.selected || "home");
  }, [args.selected]);

  return (
    <NavBar
      {...args}
      selected={selected}
      onSelect={setSelected}
      homeIcon={<HomeIcon />}
      searchIcon={<SearchIcon />}
      profileIcon={<ProfileIcon />}
    />
  );
}

export const Default: Story = {
  render: (args) => <ControlledNavBar {...args} />,
  args: {
    selected: "home",
    onSelect: () => {},
  },
};

export const SelectedHome: Story = {
  render: (args) => <ControlledNavBar {...args} />,
  args: {
    selected: "home",
    onSelect: () => {},
  },
};

export const SelectedSearch: Story = {
  render: (args) => <ControlledNavBar {...args} />,
  args: {
    selected: "search",
    onSelect: () => {},
  },
};

export const SelectedProfile: Story = {
  render: (args) => <ControlledNavBar {...args} />,
  args: {
    selected: "profile",
    onSelect: () => {},
  },
};

export const WithCustomLabels: Story = {
  render: (args) => <ControlledNavBar {...args} />,
  args: {
    selected: "home",
    itemLabels: ["Inicio", "Buscar", "Perfil"],
    onSelect: () => {},
  },
};

export const WithoutIcons: Story = {
  render: (args) => {
    return (
      <ControlledNavBar
        {...args}
        homeIcon={undefined}
        searchIcon={undefined}
        profileIcon={undefined}
      />
    );
  },
  args: {
    selected: "home",
    onSelect: () => {},
  },
};
