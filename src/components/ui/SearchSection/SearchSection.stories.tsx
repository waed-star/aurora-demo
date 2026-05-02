import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchSection } from "./SearchSection";
import type { FilterOption } from "./SearchSection.types";

const meta = {
  title: "UI/SearchSection",
  component: SearchSection,
  tags: ["autodocs"],
  argTypes: {
    active: { control: "boolean" },
    resultCount: { control: "number" },
  },
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof SearchSection>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultFilters: FilterOption[] = [
  { id: "all", label: "All" },
  { id: "images", label: "Images" },
  { id: "videos", label: "Videos" },
  { id: "news", label: "News" },
];

const filtersWithCounts: FilterOption[] = [
  { id: "all", label: "All", count: 1250 },
  { id: "images", label: "Images", count: 342 },
  { id: "videos", label: "Videos", count: 89 },
  { id: "news", label: "News", count: 156 },
];

export const Active: Story = {
  args: {
    active: true,
    filters: defaultFilters,
    resultCount: 38,
    searchPlaceholder: "Search...",
    defaultActiveFilter: "all",
  },
};

export const Inactive: Story = {
  args: {
    active: false,
    filters: defaultFilters,
    resultCount: 38,
    searchPlaceholder: "Search...",
    defaultActiveFilter: "all",
  },
};

export const WithCounts: Story = {
  args: {
    active: true,
    filters: filtersWithCounts,
    resultCount: 1250,
    searchPlaceholder: "Search the web...",
    defaultActiveFilter: "all",
  },
};

export const WithInitialSearch: Story = {
  args: {
    active: true,
    filters: defaultFilters,
    resultCount: 156,
    defaultSearchValue: "react hooks",
    searchPlaceholder: "Search...",
    defaultActiveFilter: "all",
  },
};

export const SingleResult: Story = {
  args: {
    active: true,
    filters: defaultFilters,
    resultCount: 1,
    searchPlaceholder: "Search...",
    defaultActiveFilter: "all",
  },
};

export const NoResults: Story = {
  args: {
    active: true,
    filters: defaultFilters,
    resultCount: 0,
    searchPlaceholder: "Search...",
    defaultActiveFilter: "all",
  },
};

export const CustomResultFormatter: Story = {
  args: {
    active: true,
    filters: defaultFilters,
    resultCount: 42,
    formatResultCount: (count) => `${count} matches found`,
    searchPlaceholder: "Search...",
    defaultActiveFilter: "all",
  },
};

export const NoFilters: Story = {
  args: {
    active: true,
    filters: [],
    resultCount: 100,
    searchPlaceholder: "Search...",
  },
};

export const Controlled: Story = {
  args: {
    active: true,
    filters: defaultFilters,
    resultCount: 245,
    searchValue: "typescript",
    activeFilter: "news",
    searchPlaceholder: "Search...",
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [searchValue, setSearchValue] = React.useState(
      args.searchValue || "",
    );
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [activeFilter, setActiveFilter] = React.useState(
      args.activeFilter || "all",
    );

    return (
      <div className="flex flex-col gap-lg">
        <SearchSection
          {...args}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        <div className="text-sm text-ink-muted">
          <p>Search: "{searchValue}"</p>
          <p>Filter: "{activeFilter}"</p>
        </div>
      </div>
    );
  },
};

// Import React for the controlled story
import React from "react";
