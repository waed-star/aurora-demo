import type { VariantProps } from "class-variance-authority";
import type { searchSectionVariants } from "./SearchSection";

/**
 * Represents a single filter tab option.
 * Used to populate the filter tabs row.
 */
export interface FilterOption {
  /**
   * Unique identifier for this filter.
   * Used in activeFilter prop and onFilterChange callback.
   * @example "all" | "images" | "videos" | "news"
   */
  id: string;

  /**
   * Display label for the filter tab.
   * Rendered as-is in the tab button.
   * @example "All" | "Images" | "Videos" | "News"
   */
  label: string;

  /**
   * Optional count badge displayed next to the label.
   * If provided, renders as "{label} ({count})".
   */
  count?: number;

  /**
   * Optional flag to disable this filter tab.
   * @default false
   */
  disabled?: boolean;

  /**
   * Optional icon identifier or component to render before the label.
   */
  icon?: string | React.ReactNode;
}

/**
 * Props for the SearchSection component.
 *
 * Supports both controlled and uncontrolled modes:
 * - **Controlled**: Provide searchValue + onSearchChange AND/OR activeFilter + onFilterChange
 * - **Uncontrolled**: Provide defaultSearchValue AND/OR defaultActiveFilter; component manages state
 */
export interface SearchSectionProps
  extends
    React.ComponentPropsWithoutRef<"div">,
    VariantProps<typeof searchSectionVariants> {
  // ===== SEARCH BAR - CONTROLLED MODE =====
  /**
   * The current search query value (controlled mode).
   * When provided, the component is in controlled mode for search.
   * Must be paired with onSearchChange.
   */
  searchValue?: string;

  /**
   * Callback triggered when the search input value changes.
   * Required when using searchValue (controlled mode).
   */
  onSearchChange?: (query: string) => void;

  // ===== SEARCH BAR - UNCONTROLLED MODE =====
  /**
   * Initial search query value (uncontrolled mode).
   * If searchValue is provided, this is ignored.
   * @default ""
   */
  defaultSearchValue?: string;

  /**
   * Placeholder text for the search input.
   * @default "Search..."
   */
  searchPlaceholder?: string;

  /**
   * Accessible name for the search input (aria-label).
   */
  searchAriaLabel?: string;

  /**
   * Optional callback triggered when the user clears the search input.
   */
  onClear?: () => void;

  // ===== FILTER TABS - CONTROLLED MODE =====
  /**
   * The currently active filter tab identifier (controlled mode).
   * When provided, the component is in controlled mode for filtering.
   * Must be paired with onFilterChange.
   */
  activeFilter?: string;

  /**
   * Callback triggered when a filter tab is clicked.
   * Required when using activeFilter (controlled mode).
   */
  onFilterChange?: (filterId: string) => void;

  // ===== FILTER TABS - UNCONTROLLED MODE =====
  /**
   * Initial active filter tab identifier (uncontrolled mode).
   * If activeFilter is provided, this is ignored.
   * @default undefined (first filter becomes active)
   */
  defaultActiveFilter?: string;

  /**
   * Array of filter tab options.
   * Filters render left-to-right in the order provided.
   * @default []
   */
  filters?: FilterOption[];

  // ===== RESULT COUNT =====
  /**
   * Total number of search results to display.
   * Component automatically handles singular vs plural formatting.
   * @default 0
   */
  resultCount?: number;

  /**
   * Optional custom formatter for result count display.
   * Receives the numeric count; returns formatted string.
   * @example (count) => `${count} matches found`
   */
  formatResultCount?: (count: number) => string;

  /**
   * Optional data attribute for testing/debugging.
   */
  "data-testid"?: string;
}
