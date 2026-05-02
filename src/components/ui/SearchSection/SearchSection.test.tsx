import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { SearchSection } from "./SearchSection";
import type { FilterOption } from "./SearchSection.types";

describe("SearchSection", () => {
  const defaultFilters: FilterOption[] = [
    { id: "all", label: "All" },
    { id: "images", label: "Images" },
  ];

  describe("rendering", () => {
    it("renders without crashing", () => {
      render(<SearchSection />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("renders with active=true by default", () => {
      const { container } = render(<SearchSection />);
      const root = container.firstChild;
      expect(root).toHaveClass("opacity-100");
    });

    it("renders with active=false styling when inactive", () => {
      const { container } = render(<SearchSection active={false} />);
      const root = container.firstChild;
      expect(root).toHaveClass("opacity-50", "pointer-events-none");
    });

    it("renders search input with placeholder", () => {
      render(<SearchSection searchPlaceholder="Find something..." />);
      expect(
        screen.getByPlaceholderText("Find something..."),
      ).toBeInTheDocument();
    });

    it("renders result count", () => {
      render(<SearchSection resultCount={42} />);
      expect(screen.getByText("42 results")).toBeInTheDocument();
    });

    it("renders singular result count", () => {
      render(<SearchSection resultCount={1} />);
      expect(screen.getByText("1 result")).toBeInTheDocument();
    });

    it("renders filter tabs when provided", () => {
      render(<SearchSection filters={defaultFilters} />);
      expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Images" }),
      ).toBeInTheDocument();
    });

    it("renders filter count badge", () => {
      const filtersWithCounts: FilterOption[] = [
        { id: "all", label: "All", count: 100 },
      ];
      render(<SearchSection filters={filtersWithCounts} />);
      expect(screen.getByText("(100)")).toBeInTheDocument();
    });
  });

  describe("uncontrolled mode", () => {
    it("manages search state internally", async () => {
      const user = userEvent.setup();
      render(<SearchSection />);
      const input = screen.getByRole("textbox");

      await user.type(input, "test query");
      expect(input).toHaveValue("test query");
    });

    it("initializes with defaultSearchValue", () => {
      render(<SearchSection defaultSearchValue="initial query" />);
      expect(screen.getByRole("textbox")).toHaveValue("initial query");
    });

    it("calls onSearchChange callback on input change", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<SearchSection onSearchChange={handleChange} />);
      const input = screen.getByRole("textbox");

      await user.type(input, "a");
      expect(handleChange).toHaveBeenCalledWith("a");
    });

    it("clears search on clear button click", async () => {
      const user = userEvent.setup();
      const handleClear = vi.fn();
      render(<SearchSection defaultSearchValue="test" onClear={handleClear} />);

      const clearButton = screen.getByRole("button", { name: "Clear search" });
      await user.click(clearButton);

      expect(screen.getByRole("textbox")).toHaveValue("");
      expect(handleClear).toHaveBeenCalled();
    });

    it("selects first filter by default", () => {
      render(<SearchSection filters={defaultFilters} />);
      const allTab = screen.getByRole("button", { name: "All" });
      expect(allTab).toHaveAttribute("data-state", "active");
    });

    it("calls onFilterChange when filter is clicked", async () => {
      const user = userEvent.setup();
      const handleFilterChange = vi.fn();
      render(
        <SearchSection
          filters={defaultFilters}
          onFilterChange={handleFilterChange}
        />,
      );

      const imagesTab = screen.getByRole("button", { name: "Images" });
      await user.click(imagesTab);

      expect(handleFilterChange).toHaveBeenCalledWith("images");
      expect(imagesTab).toHaveAttribute("data-state", "active");
    });
  });

  describe("controlled mode", () => {
    it("respects searchValue prop", () => {
      const { rerender } = render(<SearchSection searchValue="controlled" />);
      expect(screen.getByRole("textbox")).toHaveValue("controlled");

      rerender(<SearchSection searchValue="updated" />);
      expect(screen.getByRole("textbox")).toHaveValue("updated");
    });

    it("respects activeFilter prop", () => {
      render(<SearchSection filters={defaultFilters} activeFilter="images" />);
      const imagesTab = screen.getByRole("button", { name: "Images" });
      expect(imagesTab).toHaveAttribute("data-state", "active");
    });

    it("calls onFilterChange in controlled mode", async () => {
      const user = userEvent.setup();
      const handleFilterChange = vi.fn();
      render(
        <SearchSection
          filters={defaultFilters}
          activeFilter="all"
          onFilterChange={handleFilterChange}
        />,
      );

      const imagesTab = screen.getByRole("button", { name: "Images" });
      await user.click(imagesTab);

      expect(handleFilterChange).toHaveBeenCalledWith("images");
    });
  });

  describe("accessibility", () => {
    it("forwards ref to the root element", () => {
      const ref = createRef<HTMLDivElement>();
      render(<SearchSection ref={ref} />);
      expect(ref.current).toBeInTheDocument();
    });

    it("has accessible search input", () => {
      render(<SearchSection searchAriaLabel="Search the database" />);
      const input = screen.getByLabelText("Search the database");
      expect(input).toBeInTheDocument();
    });

    it("search input uses placeholder as aria-label when not provided", () => {
      render(<SearchSection searchPlaceholder="Find something..." />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-label", "Find something...");
    });

    it("disables filter tabs when disabled prop is true", () => {
      const filtersWithDisabled: FilterOption[] = [
        { id: "all", label: "All" },
        { id: "images", label: "Images", disabled: true },
      ];
      render(<SearchSection filters={filtersWithDisabled} />);
      const imagesTab = screen.getByRole("button", { name: "Images" });
      expect(imagesTab).toBeDisabled();
    });

    it("applies data-testid when provided", () => {
      const { container } = render(
        <SearchSection data-testid="search-widget" />,
      );
      expect(
        container.querySelector('[data-testid="search-widget"]'),
      ).toBeInTheDocument();
    });
  });

  describe("customization", () => {
    it("merges consumer className", () => {
      const { container } = render(<SearchSection className="custom-class" />);
      const root = container.firstChild;
      expect(root).toHaveClass("custom-class");
    });

    it("uses custom result formatter", () => {
      render(
        <SearchSection
          resultCount={5}
          formatResultCount={(count) => `${count} items found`}
        />,
      );
      expect(screen.getByText("5 items found")).toBeInTheDocument();
    });

    it("renders filter with icon", () => {
      const filtersWithIcon: FilterOption[] = [
        { id: "all", label: "All" },
        { id: "images", label: "Images", icon: "📸" },
      ];
      render(<SearchSection filters={filtersWithIcon} />);
      expect(screen.getByText("📸")).toBeInTheDocument();
    });
  });
});
