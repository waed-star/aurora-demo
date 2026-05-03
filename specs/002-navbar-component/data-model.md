# Data Model: NavBar Component

**Phase**: Phase 1 Design (Data Modeling)  
**Scope**: TypeScript interfaces, navigation items, state management shapes  
**Reference Implementation**: `src/components/ui/NavBar/NavBar.types.ts`

---

## Executive Summary

The NavBar component exposes a single flat component with:

- **Props API**: Controlled mode (`selected` + `onSelect` callback); no uncontrolled mode
- **Fixed Navigation Items**: Three hard-coded items — Home, Search, Profile — each with icon + label
- **State**: `selected` prop controls which item displays as active
- **Callbacks**: `onSelect(id: NavItemId)` when user clicks a navigation item
- **Accessibility**: Full keyboard navigation (Tab, Arrow keys), ARIA roles/states/labels, focus management

### Design Decisions

1. **Flat Pattern** — Single export (no compound sub-components) because the NavBar is a complete, non-decomposable bottom navigation bar. Consumers do not need to customize or reorder individual items.

2. **Controlled Mode Only** — The `selected` prop is mandatory (no uncontrolled mode). Parent component is responsible for state management and routing integration. This aligns with the spec assumption that "the component does not handle navigation logic itself; parent component is responsible for route changes and state management."

3. **Fixed Items** — Home, Search, and Profile are hard-coded. Spec states these represent the "MVP set" and are standard for bottom navigation. Future extensibility (e.g., custom items) belongs in a major version.

4. **CVA Variants** — None currently defined. Item-level variants (active/inactive) are computed from the `selected` prop; styling is derived, not explicitly selected. Reserved for future size or layout variants (e.g., `size: "sm" | "md"` for different nav bar heights).

5. **Radix for Accessibility** — Uses Radix UI focus/keyboard primitives (e.g., `FocusScope`, manual keyboard event handlers) to ensure Tab navigation between items and Arrow key cycling work correctly. Each item has `role`, `aria-current`, and `aria-label`.

6. **Icon Slot** — Icons are passed as React components (or SVG elements) via a flexible `icon` prop on each item. This decouples the NavBar from a specific icon library and allows consuming projects to provide their own icon set.

---

## TypeScript Interfaces

### Navigation Item Internal Shape: `NavItem`

```typescript
/**
 * Internal shape of a navigation item in the NavBar.
 * Not directly exposed in the public API; used for type-safety within the component.
 */
interface NavItem {
  /**
   * Unique identifier for the navigation item.
   * Used to identify which item is selected and passed to onSelect callback.
   */
  id: NavItemId;

  /**
   * Display label for the navigation item (visible to users).
   */
  label: string;

  /**
   * React component or SVG element to render as the icon.
   * Should be a small icon (typically 24x24 or 20x20 pixels).
   * Consumers provide custom icons; NavBar does not bundle icons.
   */
  icon: React.ReactNode;
}
```

### Navigation Item ID Type: `NavItemId`

```typescript
/**
 * Union type for valid navigation item identifiers.
 * Constrains selected prop and onSelect callback to valid values.
 * Helps catch typos and invalid navigation targets at compile time.
 */
type NavItemId = "home" | "search" | "profile";
```

### Root Component Props: `NavBarProps`

```typescript
/**
 * Props for the NavBar component.
 *
 * Controlled mode only: parent must provide selected + onSelect.
 * All items are hard-coded (Home, Search, Profile).
 * No uncontrolled mode; state management is the parent's responsibility.
 */
interface NavBarProps extends React.ComponentPropsWithoutRef<"nav"> {
  // ===== CONTROLLED STATE =====
  /**
   * Currently selected/active navigation item identifier.
   * Determines which item displays the active/selected visual state.
   * Must be one of: "home", "search", or "profile".
   * No default provided; parent must explicitly set this prop.
   *
   * @example selected="home"
   */
  selected: NavItemId;

  /**
   * Callback triggered when the user clicks a navigation item.
   * Called with the id of the clicked item.
   * Parent component is responsible for updating the selected prop based on this callback.
   *
   * Typical usage:
   * ```
   * const [selected, setSelected] = useState<NavItemId>("home");
   * return <NavBar selected={selected} onSelect={setSelected} />;
   * ```
   *
   * Or with routing integration (Next.js example):
   * ```
   * const router = useRouter();
   * const handleSelect = (id: NavItemId) => {
   *   router.push(`/${id}`);
   * };
   * return <NavBar selected={pathToNavId(router.pathname)} onSelect={handleSelect} />;
   * ```
   *
   * @param id - The NavItemId of the clicked item
   */
  onSelect: (id: NavItemId) => void;

  // ===== ICON PROVIDERS =====
  /**
   * Icon component or element to display for the Home navigation item.
   * Should be a small, square icon (typically 24x24 or 20x20 pixels).
   * If not provided, a default home icon placeholder may be used (implementation-dependent).
   *
   * @example <HomeIcon size={24} />
   * @example <svg>...</svg>
   */
  homeIcon?: React.ReactNode;

  /**
   * Icon component or element to display for the Search navigation item.
   * Should be a small, square icon (typically 24x24 or 20x20 pixels).
   * If not provided, a default search icon placeholder may be used.
   *
   * @example <SearchIcon size={24} />
   */
  searchIcon?: React.ReactNode;

  /**
   * Icon component or element to display for the Profile navigation item.
   * Should be a small, square icon (typically 24x24 or 20x20 pixels).
   * If not provided, a default profile icon placeholder may be used.
   *
   * @example <ProfileIcon size={24} />
   */
  profileIcon?: React.ReactNode;

  // ===== OPTIONAL CUSTOMIZATION =====
  /**
   * Optional custom aria-label for the entire NavBar nav element.
   * If not provided, defaults to "Main navigation" or similar.
   * Useful for clarity in applications with multiple navigation bars.
   *
   * @default "Main navigation"
   * @example ariaLabel="Application navigation"
   */
  ariaLabel?: string;

  /**
   * Optional array of labels for the Home, Search, and Profile items.
   * If provided, overrides the default labels.
   * Useful for internationalization or custom terminology.
   * Must be an array of exactly three strings: [homeLabel, searchLabel, profileLabel].
   *
   * @default ["Home", "Search", "Profile"]
   * @example itemLabels={["Home", "Busca", "Perfil"]} // Portuguese
   */
  itemLabels?: [string, string, string];

  // ===== STYLING & COMPOSITION =====
  /**
   * Additional CSS classes to merge into the root nav container.
   * Merged last via cn(); consumer classes always win.
   * Useful for adjusting container max-width, padding, or layout on specific viewports.
   *
   * @default ""
   * @example className="fixed bottom-0 left-0 right-0"
   */
  className?: string;
}
```

### Navigation Item Click Event: `NavSelectEvent`

```typescript
/**
 * Event object passed to onSelect callback.
 * Currently just the item id (string); defined as an interface for future extensibility.
 * If in the future we need to pass additional context (e.g., timestamp, user action type),
 * we can add fields here without breaking the callback signature.
 *
 * @example { id: "search" }
 */
interface NavSelectEvent {
  /**
   * The id of the selected navigation item.
   */
  id: NavItemId;
}
```

---

## Variant and Styling Strategy

### CVA Variant Definition (Reserved)

```typescript
/**
 * CVA variants for the NavBar component.
 * Currently empty (no size/layout variants defined).
 * Reserved for future extensions (e.g., size: "sm" | "md" | "lg").
 *
 * Individual items (Home, Search, Profile) have their styling derived from the selected prop;
 * they are not independently styled via CVA.
 */
const navBarVariants = cva(
  // Base styles: flex container, semantic tokens, no arbitrary values
  "flex items-center justify-center gap-0 w-full bg-surface border-t border-surface-border px-4 py-3",
  {
    variants: {
      // Reserved for future variants
    },
    defaultVariants: {
      // Reserved for future defaults
    },
  }
);
```

### Navigation Item Styling (Derived from `selected` Prop)

Each navigation item (Home, Search, Profile) renders with:

- **Inactive state** (selected !== item.id):
  - Text color: `text-secondary` (semantic token)
  - Background: transparent
  - Opacity: default (100%)
  - Cursor: pointer

- **Active state** (selected === item.id):
  - Text color: `text-accent` (semantic token)
  - Background: optional `bg-accent-subtle` (semantic token)
  - Opacity: default (100%)
  - Cursor: default
  - `aria-current="page"` attribute added

---

## Internal Component Shapes

### Derived Item State: `NavItemState`

```typescript
/**
 * Internal computed state for a single navigation item.
 * Derived from the NavBar's selected prop + the item id.
 * Used internally for conditional rendering and styling.
 */
interface NavItemState {
  /**
   * The item's id.
   */
  id: NavItemId;

  /**
   * Display label.
   */
  label: string;

  /**
   * Icon to render.
   */
  icon: React.ReactNode;

  /**
   * True if this item is currently selected.
   */
  isActive: boolean;

  /**
   * Callback to trigger when this item is clicked.
   */
  onClick: () => void;

  /**
   * ARIA label for the button element.
   */
  ariaLabel: string;

  /**
   * ARIA current attribute value.
   * "page" if active, undefined if inactive.
   */
  ariaCurrent?: "page";
}
```

### Context for Item Rendering: `NavBarContextValue`

```typescript
/**
 * Context value passed to internal item rendering logic.
 * Not exposed in the public API; purely internal.
 * Could be used if component architecture evolves to use React Context.
 */
interface NavBarContextValue {
  /**
   * The currently selected item id.
   */
  selected: NavItemId;

  /**
   * Callback to invoke when an item is clicked.
   */
  onSelect: (id: NavItemId) => void;

  /**
   * Array of all navigation items (Home, Search, Profile).
   */
  items: NavItem[];
}
```

---

## Token Requirements

The component consumes the following semantic tokens (Layer 2):

| Token | Usage | Example Value (Light) |
|-------|-------|----------------------|
| `--color-surface` | NavBar background | `#ffffff` |
| `--color-surface-border` | Top border color | `#e5e7eb` |
| `--color-text-secondary` | Inactive item text | `#6b7280` |
| `--color-text-accent` | Active item text | `#0066ff` |
| `--color-bg-accent-subtle` | Active item background (optional) | `#f0f7ff` |
| `--spacing-sm` | Gap between items (if any) | `0.5rem` (4px) |
| `--spacing-md` | Padding inside item | `0.75rem` (12px) |
| `--radius-sm` | Border radius for item background | `0.375rem` (6px) |

If any of these tokens are missing from `src/styles/tokens.css`, implementation will be blocked until tokens are added per Aurora conventions.

---

## Accessibility Compliance

### ARIA Attributes

- **NavBar root**: `role="navigation"`, `aria-label="Main navigation"` (customizable via `ariaLabel` prop)
- **Each item button**: 
  - `role="button"` (or `tabindex="0"` if using plain divs)
  - `aria-label="{item label}"` (e.g., "Go to Home section")
  - `aria-current="page"` (on active item only)

### Keyboard Navigation

- **Tab**: Move focus between items (left-to-right, then wrap to first)
- **Shift+Tab**: Move focus backward (right-to-left, then wrap to last)
- **Arrow Right**: Move focus to next item (with wrap)
- **Arrow Left**: Move focus to previous item (with wrap)
- **Enter / Space**: Activate focused item (trigger `onSelect`)

### Focus Indicators

- Each item must display a visible focus indicator (ring, underline, or background change) when focused
- Focus indicator color must meet WCAG AA contrast ratio (≥ 4.5:1 against background)
- No focus indicator may be removed without providing an alternative

### Touch Targets

- Each navigation item must have a minimum touch target size of 44×44 pixels (SC-005 in spec)
- Padding should be adjusted to meet this requirement on mobile viewports

---

## Usage Examples

### Basic Controlled Component

```typescript
import { NavBar } from "@/components/ui/NavBar";
import { useState } from "react";

export function MyApp() {
  const [selected, setSelected] = useState<NavItemId>("home");

  return (
    <NavBar
      selected={selected}
      onSelect={setSelected}
    />
  );
}
```

### With Custom Icons

```typescript
import { NavBar } from "@/components/ui/NavBar";
import { Home, Search, User } from "lucide-react"; // Example icon library

export function MyApp() {
  const [selected, setSelected] = useState<NavItemId>("home");

  return (
    <NavBar
      selected={selected}
      onSelect={setSelected}
      homeIcon={<Home size={24} />}
      searchIcon={<Search size={24} />}
      profileIcon={<User size={24} />}
    />
  );
}
```

### With Routing Integration (React Router)

```typescript
import { NavBar } from "@/components/ui/NavBar";
import { useNavigate, useLocation } from "react-router-dom";

const pathToNav: Record<string, NavItemId> = {
  "/": "home",
  "/search": "search",
  "/profile": "profile",
};

const navToPath: Record<NavItemId, string> = {
  home: "/",
  search: "/search",
  profile: "/profile",
};

export function MyApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const selected = pathToNav[location.pathname] || "home";

  return (
    <NavBar
      selected={selected}
      onSelect={(id) => navigate(navToPath[id])}
    />
  );
}
```

---

## Implementation Checklist

- [ ] Implement NavBar.tsx with forwardRef, displayName, and className merging
- [ ] Add full keyboard navigation (Tab, Arrow keys, Enter/Space)
- [ ] Implement ARIA attributes and roles
- [ ] Create semantic token-based styling (no hard-coded colors)
- [ ] Write unit tests (all variants, keyboard interactions, ARIA verification)
- [ ] Create Storybook stories (default, with custom icons, different selected states)
- [ ] Verify mobile touch target sizes (44×44 minimum)
- [ ] Verify focus indicator contrast (AA minimum)
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Verify CSS custom property overrides work in dark theme
