# Data Model: Navigation Bar Component

## TypeScript Props Interface

```typescript
export interface NavigationItem {
  /**
   * Unique identifier for the navigation item
   */
  id: string;

  /**
   * Display label for the navigation item
   */
  label: string;

  /**
   * Icon identifier or React component (e.g., from lucide-react)
   */
  icon: React.ComponentType<{ className?: string }>;

  /**
   * Whether this item is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * ARIA label for accessibility
   * @default undefined (falls back to label prop)
   */
  ariaLabel?: string;
}

export interface NavProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Array of navigation items to display
   */
  items: NavigationItem[];

  /**
   * Currently selected item ID (controlled mode)
   */
  selected?: string;

  /**
   * Default selected item ID (uncontrolled mode)
   */
  defaultSelected?: string;

  /**
   * Callback fired when a navigation item is selected
   */
  onChange?: (itemId: string) => void;

  /**
   * Custom className to merge (merged last via cn())
   */
  className?: string;

  /**
   * Support for asChild pattern via Radix Slot
   */
  asChild?: boolean;
}
```

## CVA Variant Shape

```typescript
export const navVariants = cva(
  // Base styles applied to all Nav components
  "flex flex-row items-center justify-between gap-md bg-surface border-t border-line px-md py-sm",
  {
    variants: {
      // No size variants for Nav (full-width component)
      // No color variants (semantic tokens only)
      // Variant state handled by individual nav items
    },
    defaultVariants: {
      // Nav is a full-width container with no variants
    },
  }
);

export const navItemVariants = cva(
  // Base styles for individual navigation items
  "flex flex-col items-center gap-xs px-sm py-sm rounded-md transition-colors cursor-pointer",
  {
    variants: {
      selected: {
        true: "text-accent bg-surface-muted",
        false: "text-ink-muted hover:text-ink",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "",
      },
    },
    defaultVariants: {
      selected: false,
      disabled: false,
    },
  }
);
```

## State Interfaces

### Uncontrolled State (Internal)

```typescript
interface NavState {
  /**
   * Currently selected item ID (managed internally)
   */
  selectedId: string;

  /**
   * Item currently focused via keyboard navigation
   */
  focusedId?: string;
}
```

### Controlled State (Prop-Based)

```typescript
// No additional internal state needed when controlled via props
// The selected prop is the source of truth
```

## Component Architecture

- **Pattern**: Flat (single exported component)
- **State Management**: Supports both controlled (`selected` + `onChange`) and uncontrolled (`defaultSelected`) modes
- **Accessibility**: Keyboard navigation (arrow keys), ARIA roles/labels, focus management
- **Tokens**: All styling via semantic Tailwind utilities (`text-accent`, `bg-surface`, `text-ink-muted`, etc.)

## Integration Notes

- Component receives `items` array with icon components (e.g., from `lucide-react`)
- Each item renders icon + label vertically stacked
- Selected item shows accent color background
- Unselected items show muted text with hover effect
- Disabled items show reduced opacity
- Component is full-width container; typically positioned at top or bottom of viewport
