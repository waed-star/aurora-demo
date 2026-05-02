# Data Model: SearchSection Component

**Phase**: Phase 1 Design (Data Modeling)  
**Scope**: TypeScript interfaces, CVA variants, state management shapes  
**Reference Implementation**: `src/components/ui/SearchSection/SearchSection.types.ts`

---

## Executive Summary

The SearchSection component exposes a single flat component with:

- **Props API**: Controlled mode (value + onChange callbacks) + uncontrolled mode (defaultValue + defaultActiveFilter)
- **CVA Variants**: Single `active` variant (Yes/No) controlling visibility/interactivity
- **Internal State**: Manages search query and active filter selection in uncontrolled mode
- **Callbacks**: `onSearchChange`, `onFilterChange`, optional `onClear`

### Design Decisions

1. **Flat Pattern** — Single export (no compound sub-components) because consumers do not need to reorder/customize individual sections independently.
2. **Controlled + Uncontrolled** — Support both for flexible consumer integration:
   - **Controlled**: Parent manages search state and filter selection
   - **Uncontrolled**: Component manages internal state; parent only receives callbacks
3. **CVA Single Variant** — Only `active` (boolean) controls layout:
   - `active: true` → All sections visible, fully interactive
   - `active: false` → Visually de-emphasized, reduced opacity or collapsed
4. **Radix Tabs for Filter Tabs** — Use Radix Tabs primitive to handle focus management, keyboard navigation, and ARIA state automatically.
5. **Native HTML Input** — Search input uses native `<input>` element with manual ARIA labels and accessibility attributes.

---

## TypeScript Interfaces

### Root Component Props: `SearchSectionProps`

```typescript
/**
 * Props for the SearchSection component.
 *
 * Supports both controlled and uncontrolled modes:
 * - **Controlled**: Provide searchValue + onSearchChange AND/OR activeFilter + onFilterChange
 * - **Uncontrolled**: Provide defaultSearchValue AND/OR defaultActiveFilter; component manages state
 *
 * Mixing controlled + uncontrolled modes for the same field is an anti-pattern and will trigger a warning.
 */
interface SearchSectionProps extends React.ComponentPropsWithoutRef<"div"> {
  // ===== VARIANT =====
  /**
   * Controls component visibility and interactivity state.
   * @default true
   */
  active?: boolean;

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
   * Called with the new query string on each input change (debouncing is consumer's responsibility).
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
   * If not provided, derived from searchPlaceholder or defaults to "Search".
   */
  searchAriaLabel?: string;

  /**
   * Optional callback triggered when the user clears the search input (e.g., via a clear button or Escape key).
   * Called with empty string. Useful for resetting filters or results alongside search.
   */
  onClear?: () => void;

  // ===== FILTER TABS - CONTROLLED MODE =====
  /**
   * The currently active filter tab identifier (controlled mode).
   * When provided, the component is in controlled mode for filtering.
   * Must be paired with onFilterChange.
   * Should match one of the values in the filters array.
   */
  activeFilter?: string;

  /**
   * Callback triggered when a filter tab is clicked.
   * Required when using activeFilter (controlled mode).
   * Called with the selected filter's id.
   */
  onFilterChange?: (filterId: string) => void;

  // ===== FILTER TABS - UNCONTROLLED MODE =====
  /**
   * Initial active filter tab identifier (uncontrolled mode).
   * If activeFilter is provided, this is ignored.
   * Should match one of the filter ids in the filters array.
   * If not provided, the first filter (if any) becomes active.
   * @default undefined (first filter, if present, becomes active)
   */
  defaultActiveFilter?: string;

  /**
   * Array of filter tab options.
   * Each filter defines an id (unique, used in callbacks) and a label (visible text).
   * Filters render left-to-right in the order provided.
   * @default []
   */
  filters?: FilterOption[];

  // ===== RESULT COUNT =====
  /**
   * Total number of search results to display.
   * Component automatically handles singular ("1 result") vs plural ("42 results") formatting.
   * @default 0
   */
  resultCount?: number;

  /**
   * Optional custom formatter for result count display.
   * Receives the numeric count; returns formatted string.
   * If not provided, defaults to "{count} result(s)" with automatic pluralization.
   * @example (count) => `${count} matches found`
   */
  formatResultCount?: (count: number) => string;

  // ===== STYLING & COMPOSITION =====
  /**
   * Additional CSS classes to merge into the root container.
   * Merged last via cn(); consumer classes always win.
   * @default ""
   */
  className?: string;

  /**
   * Optional data attribute for testing/debugging.
   */
  "data-testid"?: string;

  // ===== FORWARDED REF =====
  // Implicit: ref?: React.Ref<HTMLDivElement>
}
```

### Filter Option Interface: `FilterOption`

```typescript
/**
 * Represents a single filter tab option.
 * Used to populate the filter tabs row.
 */
interface FilterOption {
  /**
   * Unique identifier for this filter.
   * Used in activeFilter prop and onFilterChange callback.
   * Must be unique across all filters in the component.
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
   * If provided, renders as "{label} ({count})" or "{label} • {count}".
   * Useful for showing result counts per filter without requiring separate state.
   */
  count?: number;

  /**
   * Optional flag to disable this filter tab (greyed out, non-interactive).
   * @default false
   */
  disabled?: boolean;

  /**
   * Optional icon identifier or component to render before the label.
   * Implementation detail left to consuming app (e.g., "image-icon", SVG component).
   * May be used for visual affordance per filter type.
   */
  icon?: string | React.ReactNode;
}
```

---

## CVA (Class Variance Authority) Variant Shape

### Variant Definition: `SearchSectionVariants`

The SearchSection uses CVA to manage the single `active` variant that controls layout, visibility, and interactivity styling:

```typescript
import { cva, type VariantProps } from "class-variance-authority";

export const searchSectionVariants = cva(
  // Base classes (applied regardless of variant)
  [
    "flex flex-col gap-spacing-md",
    "transition-opacity duration-fast",
    "bg-surface text-ink",
    "rounded-radius-sm border border-boundary",
    "px-spacing-md py-spacing-lg",
  ],
  {
    variants: {
      // ===== ACTIVE VARIANT =====
      active: {
        // ===== active: true (Active/Yes state) =====
        true: [
          "opacity-100", // Fully opaque
          "pointer-events-auto", // Interactive
          "shadow-sm", // Subtle shadow for depth
        ],

        // ===== active: false (Inactive/No state) =====
        false: [
          "opacity-50", // De-emphasized
          "pointer-events-none", // Not interactive
          "bg-surface-muted", // Optional alternate surface
          "shadow-none", // No shadow when inactive
        ],
      },
    },

    defaultVariants: {
      active: true, // Component starts in Active=Yes state by default
    },
  },
);

/**
 * Extract variant props type for type safety.
 * Used in component props extension:
 * type SearchSectionProps = React.ComponentPropsWithoutRef<'div'> & VariantProps<typeof searchSectionVariants>;
 */
export type SearchSectionVariants = VariantProps<typeof searchSectionVariants>;
```

### Token Mapping

The CVA uses semantic tokens exclusively (Layer 2):

| Token                        | Value (Light)                   | Value (Dark)            | Usage                     |
| ---------------------------- | ------------------------------- | ----------------------- | ------------------------- |
| `bg-surface`                 | `--color-surface`               | `--color-surface-dark`  | Container background      |
| `text-ink`                   | `--color-ink`                   | `--color-ink-dark`      | Text color                |
| `border-boundary`            | `--color-boundary`              | `--color-boundary-dark` | Border color              |
| `rounded-radius-sm`          | `--radius-sm` (e.g., 4px)       | Same                    | Border radius             |
| `gap-spacing-md`             | `--spacing-md` (e.g., 16px)     | Same                    | Flex gap between sections |
| `px-spacing-md`              | `--spacing-md`                  | Same                    | Horizontal padding        |
| `py-spacing-lg`              | `--spacing-lg` (e.g., 24px)     | Same                    | Vertical padding          |
| `shadow-sm`                  | `--shadow-sm`                   | `--shadow-sm-dark`      | Subtle shadow             |
| `opacity-100` / `opacity-50` | Native CSS                      | Native CSS              | Visibility control        |
| `duration-fast`              | `--duration-fast` (e.g., 150ms) | Same                    | Transition speed          |

All tokens are defined in `src/styles/tokens.css` and exposed as Tailwind utilities in `src/index.css`.

---

## Internal State Interfaces

### Uncontrolled State: `SearchSectionInternalState`

When the component operates in uncontrolled mode (no `searchValue` or `activeFilter` provided), it manages internal state:

```typescript
/**
 * Internal state managed by SearchSection when operating in uncontrolled mode.
 * Automatically initialized from defaultSearchValue and defaultActiveFilter props.
 */
interface SearchSectionInternalState {
  /**
   * Current search query value (uncontrolled mode).
   * Initialized from defaultSearchValue; updated on input change via onSearchChange callback.
   */
  searchQuery: string;

  /**
   * Currently active filter tab id (uncontrolled mode).
   * Initialized from defaultActiveFilter or first filter in array; updated on tab click via onFilterChange.
   */
  activeFilterId: string | null;
}
```

**State Initialization Logic**:

```typescript
const [internalState, setInternalState] = useState<SearchSectionInternalState>(
  () => ({
    searchQuery: defaultSearchValue ?? "",
    activeFilterId: defaultActiveFilter ?? filters?.[0]?.id ?? null,
  }),
);
```

**State Update Patterns**:

```typescript
// Update search query (uncontrolled mode only)
const handleSearchChange = (query: string) => {
  if (!isControlledSearch) {
    setInternalState((prev) => ({ ...prev, searchQuery: query }));
  }
  onSearchChange?.(query); // Always call callback regardless of mode
};

// Update active filter (uncontrolled mode only)
const handleFilterChange = (filterId: string) => {
  if (!isControlledFilter) {
    setInternalState((prev) => ({ ...prev, activeFilterId: filterId }));
  }
  onFilterChange?.(filterId); // Always call callback regardless of mode
};
```

**Controlled vs Uncontrolled Detection**:

```typescript
// Determine if search is controlled
const isControlledSearch = searchValue !== undefined;
const searchDisplay = isControlledSearch
  ? searchValue
  : internalState.searchQuery;

// Determine if filter is controlled
const isControlledFilter = activeFilter !== undefined;
const filterDisplay = isControlledFilter
  ? activeFilter
  : internalState.activeFilterId;
```

---

## Sub-Section Component Props (Reference)

While SearchSection is exported as a flat component, internally it may use sub-components for clarity. These interfaces document the internal shape but are not public exports:

### SearchBar Sub-Component Props: `SearchBarProps` (Internal)

```typescript
/**
 * Internal props for the search bar section.
 * Not exported; used only within SearchSection component implementation.
 */
interface SearchBarProps {
  value: string;
  onChange: (query: string) => void;
  onClear?: () => void;
  placeholder?: string;
  ariaLabel?: string;
  disabled?: boolean; // Controlled by parent's active state
  icon?: React.ReactNode; // Search icon or SVG
  className?: string;
}
```

### FilterTabs Sub-Component Props: `FilterTabsProps` (Internal)

```typescript
/**
 * Internal props for the filter tabs section.
 * Uses Radix Tabs primitive internally for accessibility.
 * Not exported; used only within SearchSection component implementation.
 */
interface FilterTabsProps {
  filters: FilterOption[];
  activeFilterId: string | null;
  onFilterChange: (filterId: string) => void;
  disabled?: boolean; // Controlled by parent's active state
  className?: string;
}
```

### ResultCount Sub-Component Props: `ResultCountProps` (Internal)

```typescript
/**
 * Internal props for the result count display section.
 * Not exported; used only within SearchSection component implementation.
 */
interface ResultCountProps {
  count: number;
  formatter?: (count: number) => string;
  className?: string;
}
```

---

## Constraints & Validation Rules

### Props Validation

1. **Controlled Mode for Search**:
   - If `searchValue` is provided, `onSearchChange` must also be provided.
   - If only `onSearchChange` is provided without `searchValue`, component operates in uncontrolled mode.
   - Mixing `searchValue` (controlled) with `defaultSearchValue` (uncontrolled) triggers a warning and ignores `defaultSearchValue`.

2. **Controlled Mode for Filter**:
   - If `activeFilter` is provided, `onFilterChange` must also be provided.
   - If only `onFilterChange` is provided without `activeFilter`, component operates in uncontrolled mode.
   - Mixing `activeFilter` (controlled) with `defaultActiveFilter` (uncontrolled) triggers a warning and ignores `defaultActiveFilter`.

3. **Filter Options Validation**:
   - If `filters` is provided and is non-empty, and `activeFilter` or `defaultActiveFilter` is provided, the active filter must exist in the filters array (by id).
   - If `activeFilter` does not exist in the array, component defaults to first filter.
   - Warning logged in development.

4. **Result Count**:
   - Must be a non-negative integer.
   - If `resultCount` is negative or non-numeric, defaults to 0 and logs warning.

### Keyboard Interactions

- **Search Input**: Standard HTML input (Enter to submit, Escape to clear if supported)
- **Filter Tabs**: Radix Tabs handles Tab/Shift+Tab (focus navigation), Arrow Left/Right (tab selection), Enter/Space to activate
- **Global**: When `active: false`, all interactive elements are disabled (`pointer-events-none`)

### Pluralization Logic

```typescript
/**
 * Default result count formatter.
 * Handles singular/plural forms automatically.
 */
function defaultFormatResultCount(count: number): string {
  if (count === 0) return "0 results";
  if (count === 1) return "1 result";
  return `${count} results`;
}
```

---

## Example Usage Patterns

### Controlled Mode (Parent Manages State)

```typescript
export function SearchApp() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  return (
    <SearchSection
      active={true}
      searchValue={search}
      onSearchChange={setSearch}
      activeFilter={filter}
      onFilterChange={setFilter}
      filters={[
        { id: 'all', label: 'All' },
        { id: 'images', label: 'Images' },
        { id: 'videos', label: 'Videos' },
      ]}
      resultCount={42}
    />
  );
}
```

### Uncontrolled Mode (Component Manages State)

```typescript
export function SearchApp() {
  return (
    <SearchSection
      active={true}
      defaultSearchValue=""
      defaultActiveFilter="all"
      onSearchChange={(query) => console.log('Search:', query)}
      onFilterChange={(filterId) => console.log('Filter:', filterId)}
      filters={[
        { id: 'all', label: 'All' },
        { id: 'images', label: 'Images', count: 120 },
        { id: 'videos', label: 'Videos', count: 45 },
      ]}
      resultCount={165}
    />
  );
}
```

### Variant: Inactive State

```typescript
<SearchSection
  active={false}  // Component is visually de-emphasized and non-interactive
  filters={[...]}
  resultCount={0}
/>
```

---

## Next Steps (Phase 2 Implementation)

1. Create [SearchSection.types.ts](../../src/components/ui/SearchSection/SearchSection.types.ts) with all interfaces defined above.
2. Implement SearchSection.tsx using CVA for variants and Radix Tabs for filter accessibility.
3. Add comprehensive JSDoc comments matching these signatures.
4. Create SearchSection.stories.tsx with Storybook stories for all variant combinations.
5. Create SearchSection.test.tsx with tests for controlled/uncontrolled modes, callbacks, and accessibility.
6. Ensure all tokens used in CVA are defined in src/styles/tokens.css and mapped to Tailwind in src/index.css.
