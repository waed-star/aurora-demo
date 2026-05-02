import { forwardRef, useState, useMemo } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { SearchSectionProps, FilterOption } from "./SearchSection.types";

export const searchSectionVariants = cva(
  [
    "flex flex-col gap-md",
    "transition-opacity duration-fast",
    "bg-surface text-ink",
    "rounded-md border border-line",
    "px-md py-lg",
  ],
  {
    variants: {
      active: {
        true: ["opacity-100", "pointer-events-auto", "shadow-md"],
        false: [
          "opacity-50",
          "pointer-events-none",
          "bg-surface-muted",
          "shadow-none",
        ],
      },
    },
    defaultVariants: {
      active: true,
    },
  },
);

export const SearchSection = forwardRef<HTMLDivElement, SearchSectionProps>(
  (
    {
      active = true,
      searchValue,
      onSearchChange,
      defaultSearchValue = "",
      searchPlaceholder = "Search...",
      searchAriaLabel,
      onClear,
      activeFilter,
      onFilterChange,
      defaultActiveFilter,
      filters = [],
      resultCount = 0,
      formatResultCount,
      className,
      "data-testid": dataTestId,
      ...props
    },
    ref,
  ) => {
    // ===== DETECT CONTROLLED VS UNCONTROLLED MODE =====
    const isControlledSearch = searchValue !== undefined;
    const isControlledFilter = activeFilter !== undefined;

    // ===== INTERNAL STATE FOR UNCONTROLLED MODE =====
    const [internalState, setInternalState] = useState(() => ({
      searchQuery: defaultSearchValue,
      activeFilterId: defaultActiveFilter ?? filters[0]?.id ?? null,
    }));

    // ===== DERIVED VALUES =====
    const displaySearchValue = isControlledSearch
      ? searchValue
      : internalState.searchQuery;
    const displayActiveFilter = isControlledFilter
      ? activeFilter
      : internalState.activeFilterId;

    // ===== FORMATTED RESULT COUNT =====
    const formattedResultCount = useMemo(() => {
      if (formatResultCount) {
        return formatResultCount(resultCount);
      }
      return resultCount === 1 ? "1 result" : `${resultCount} results`;
    }, [resultCount, formatResultCount]);

    // ===== EVENT HANDLERS =====
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.currentTarget.value;
      if (!isControlledSearch) {
        setInternalState((prev) => ({ ...prev, searchQuery: newValue }));
      }
      onSearchChange?.(newValue);
    };

    const handleClear = () => {
      if (!isControlledSearch) {
        setInternalState((prev) => ({ ...prev, searchQuery: "" }));
      }
      onClear?.();
      onSearchChange?.("");
    };

    const handleFilterChange = (filterId: string) => {
      if (!isControlledFilter) {
        setInternalState((prev) => ({ ...prev, activeFilterId: filterId }));
      }
      onFilterChange?.(filterId);
    };

    return (
      <div
        ref={ref}
        className={cn(searchSectionVariants({ active }), className)}
        data-testid={dataTestId}
        {...props}
      >
        {/* ===== SEARCH BAR ===== */}
        <div className="flex items-center gap-sm rounded-md bg-surface-muted px-sm py-sm">
          {/* Search Icon */}
          <svg
            className="h-sm w-sm flex-shrink-0 text-ink-muted"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          {/* Input Field */}
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={displaySearchValue}
            onChange={handleSearchChange}
            aria-label={searchAriaLabel ?? searchPlaceholder}
            className={cn(
              "flex-1 bg-transparent text-ink",
              "placeholder-ink-muted",
              "focus:outline-none",
              "text-base",
            )}
          />

          {/* Clear Button */}
          {displaySearchValue && (
            <button
              type="button"
              onClick={handleClear}
              className="flex-shrink-0 text-ink-muted hover:text-ink transition-colors"
              aria-label="Clear search"
            >
              <svg
                className="h-sm w-sm"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
              </svg>
            </button>
          )}
        </div>

        {/* ===== FILTER TABS ===== */}
        {filters.length > 0 && (
          <Tabs.Root
            value={displayActiveFilter ?? ""}
            onValueChange={handleFilterChange}
            className="w-full"
          >
            <Tabs.List className="flex gap-sm border-b border-line overflow-x-auto">
              {filters.map((filter: FilterOption) => (
                <Tabs.Trigger
                  key={filter.id}
                  value={filter.id}
                  disabled={filter.disabled}
                  className={cn(
                    "inline-flex items-center gap-xs px-sm py-xs text-sm font-medium",
                    "whitespace-nowrap border-b-2 border-transparent",
                    "text-ink-muted hover:text-ink transition-colors",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "data-[state=active]:border-accent data-[state=active]:text-accent",
                  )}
                >
                  {filter.icon && (
                    <span className="flex-shrink-0">{filter.icon}</span>
                  )}
                  <span>{filter.label}</span>
                  {filter.count !== undefined && (
                    <span className="text-xs text-ink-muted">
                      ({filter.count})
                    </span>
                  )}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </Tabs.Root>
        )}

        {/* ===== RESULT COUNT ===== */}
        <div className="text-sm text-ink-muted">{formattedResultCount}</div>
      </div>
    );
  },
);

SearchSection.displayName = "SearchSection";
