# Implementation Plan: Navigation Bar Component

**Feature Branch**: `001-nav-bar`  
**Component**: `Nav`  
**Status**: Planning Phase  
**Last Updated**: May 2, 2026

---

## I. Technical Context

### Tech Stack

- **React**: 19.2.5 (with new hooks and concurrent features)
- **TypeScript**: 6.0.3 (with strict mode enabled)
- **Tailwind CSS**: 4.2.4 (@tailwindcss/vite for integration)
- **Build Tool**: Vite (with React plugin)
- **Testing**: Vitest with Playwright browser tests
- **Component Documentation**: Storybook 10.3.5

### Design System Framework

- **Design Tokens**: CSS custom properties (Layer 2 Semantic only)
  - Location: `src/styles/tokens.css`
  - Exposed via Tailwind utilities in `src/index.css`
  - Theme support: `data-theme="dark"` on `:root`
- **Token Categories**: Color, Typography, Spacing, Radius & Shadow
- **Theming**: Pure CSS (no JavaScript runtime theme switching)

### Utility Functions

- **`cn()`** at `src/lib/utils.ts`: Class merging via `clsx` + `tailwind-merge`
  - Handles Tailwind conflict resolution
  - Consumer classes always win (merged last)
- **CVA (Class Variance Authority)**: v0.7.1 for variant management
- **Icons**: `lucide-react` (v1.11.0) as the icon library

### Required Dependencies

#### Already Installed

```json
{
  "@radix-ui/react-slot": "^1.2.4",
  "@radix-ui/react-dialog": "^1.1.15",
  "@radix-ui/react-tabs": "^1.1.13",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "lucide-react": "^1.11.0",
  "tailwind-merge": "^3.5.0",
  "tailwindcss": "^4.2.4"
}
```

#### New Dependencies to Add

**`@radix-ui/react-primitive`** (v1.0.3+ recommended):
- Provides a base component wrapper for forwarding refs and merging props
- Used to render the root navigation container with accessibility support

**Installation**:
```bash
npm install @radix-ui/react-primitive
```

---

## II. Component Architecture

### Pattern: Flat Component

**Rationale**: Nav is a single logical unit—it renders as one cohesive navigation bar with no independently composable sub-parts. A flat pattern is appropriate.

The component API does not require sub-components like `Nav.Item`, `Nav.List`, etc., as navigation items are passed as data to a single root component.

### Reference Implementation Pattern

The Nav component will follow the Aurora design system patterns:

```tsx
// ✅ Follows constitution:
// - forwardRef wrapper
// - className merged last via cn()
// - displayName set explicitly
// - All styling via semantic tokens
// - Controlled + uncontrolled state support

export const Nav = forwardRef<HTMLElement, NavProps>(
  ({ items, selected, onChange, defaultSelected, className, ...props }, ref) => (
    <nav ref={ref} className={cn("base-nav-classes", className)} {...props}>
      {items.map((item) => (
        <NavItem
          key={item.id}
          item={item}
          isSelected={selected === item.id}
          onChange={onChange}
        />
      ))}
    </nav>
  ),
);
Nav.displayName = "Nav";
```

---

## III. Data Model

### Type Definitions

#### `NavigationItem`

Represents a single navigation item in the bar.

```typescript
export interface NavigationItem {
  /** Unique identifier for the navigation item */
  id: string;

  /** Display label shown below or next to the icon */
  label: string;

  /** Icon component (React component accepting standard SVG props) or icon name */
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>> | string;

  /** Whether the navigation item is disabled (optional, defaults to false) */
  disabled?: boolean;

  /** Additional props passed to the navigation item element (optional) */
  ariaLabel?: string;
}
```

#### `NavProps`

Main component props interface.

```typescript
export interface NavProps extends React.HTMLAttributes<HTMLElement> {
  /** Array of navigation items to display */
  items: NavigationItem[];

  /** Controlled: Currently selected item ID (required if onChange is provided) */
  selected?: string;

  /** Uncontrolled: Default selected item ID (ignored if selected is provided) */
  defaultSelected?: string;

  /** Callback fired when user selects a navigation item */
  onChange?: (itemId: string) => void;

  /** Additional CSS classes merged via cn() (consumer classes win) */
  className?: string;

  /** Ref forwarded to the root nav element */
  ref?: React.Ref<HTMLElement>;

  /** Aria-label for the navigation container */
  "aria-label"?: string;
}
```

#### Internal State Interface

```typescript
interface NavState {
  /** The currently selected item ID */
  selectedId: string | null;

  /** Whether the component is in controlled mode */
  isControlled: boolean;

  /** Focused item (for keyboard navigation in future versions) */
  focusedId?: string | null;
}
```

---

## IV. Component States & Variants

### Visual States

Each navigation item can be in one of these states:

| State | Description | Token Usage |
|-------|-------------|------------|
| **Default** (unselected) | Item is visible but not selected | `text-ink-secondary`, `bg-transparent` |
| **Selected** | Currently active navigation item | `text-accent`, `bg-surface-hover` or underline `border-accent` |
| **Hover** | User hovers over an unselected item | `text-ink`, `bg-surface-hover` |
| **Focus** | Item has keyboard focus | Focus ring via `focus-visible:ring-accent` |
| **Disabled** | Item is disabled and non-interactive | `text-ink-disabled`, `cursor-not-allowed`, `opacity-50` |

### Variants

The component should support the following variants as per the spec:

1. **Selected=Home** — Home item selected, Profile and Search unselected
2. **Selected=Profile** — Profile item selected, Home and Search unselected
3. **Selected=Search** — Search item selected, Home and Profile unselected

All variants share the same component structure; variants are created by passing different `selected` prop values.

---

## V. Project Structure

### File Locations

All files will be created under `src/components/ui/Nav/`:

```
src/components/ui/Nav/
├── index.ts                    # Named exports
├── Nav.tsx                      # Main component implementation
├── Nav.types.ts                 # Type definitions
├── Nav.stories.tsx              # Storybook stories
└── Nav.test.tsx                 # Unit tests
```

### File Responsibilities

#### `index.ts`
```typescript
export { Nav } from "./Nav";
export type { NavProps, NavigationItem } from "./Nav.types";
```

#### `Nav.types.ts`
- All TypeScript interfaces: `NavProps`, `NavigationItem`, `NavState` (internal)
- Type exports for consuming applications

#### `Nav.tsx`
- Main component implementation
- Internal `NavItem` sub-component (not exported)
- `forwardRef` wrapper
- State management (controlled + uncontrolled)
- All Tailwind utility classes using semantic tokens
- Accessibility attributes (ARIA roles, labels, states)

#### `Nav.stories.tsx`
- Stories for all three variants: Selected=Home, Selected=Profile, Selected=Search
- Controlled vs uncontrolled examples
- Disabled items example
- Custom className example
- Responsive layout example (if applicable)

#### `Nav.test.tsx`
- Unit tests covering:
  - Rendering all navigation items
  - Selection state changes on click
  - Controlled vs uncontrolled behavior
  - onChange callback invocation
  - className prop merging
  - forwardRef forwarding
  - Disabled state handling
  - Keyboard navigation (Tab, focus management)
  - ARIA attributes

---

## VI. Semantic Token Requirements

### Tokens Used

The component will consume these semantic tokens (all from Layer 2):

| Token | Purpose | Examples |
|-------|---------|----------|
| `text-ink` | Primary text color for selected items | `text-ink` |
| `text-ink-secondary` | Secondary text for unselected items | `text-ink-secondary` |
| `text-ink-disabled` | Disabled item text | `text-ink-disabled` |
| `text-accent` | Accent color for active/selected state | `text-accent` |
| `bg-surface` | Background for nav container | `bg-surface` |
| `bg-surface-hover` | Hover state background | `hover:bg-surface-hover` |
| `border-accent` | Border for selected indicator | `border-accent` |
| `border-line` | Divider lines (if used) | `border-line` |

### Required Tokens (to Verify in `src/styles/tokens.css`)

Before implementation, verify these semantic tokens exist:
- `--color-ink` → Tailwind utility `text-ink`
- `--color-ink-secondary` → `text-ink-secondary`
- `--color-ink-disabled` → `text-ink-disabled`
- `--color-accent` → `text-accent`
- `--color-surface` → `bg-surface`
- `--color-surface-hover` → `bg-surface-hover`
- `--border-accent` → `border-accent`
- `--border-line` → `border-line`

If any token is missing, it must be added to `src/styles/tokens.css` and re-exported via `src/index.css` before component implementation.

---

## VII. Accessibility Requirements

### WCAG 2.1 AA Compliance

The component must meet these accessibility standards:

| Criterion | Implementation |
|-----------|-----------------|
| **ARIA Roles** | `<nav>` element with `role="navigation"` (implicit) |
| **ARIA Labels** | `aria-label` or `aria-labelledby` on nav element |
| **Button Roles** | Each item should have `role="button"` or be a native `<button>` |
| **Focus Management** | Focus ring visible on Tab navigation, uses `focus-visible` |
| **Keyboard Navigation** | Tab to items, Space/Enter to select (future: Arrow keys) |
| **Disabled State** | `aria-disabled="true"` or `disabled` attribute on disabled items |
| **Selected State** | `aria-current="page"` on selected item (semantic) |
| **Color Contrast** | All text must meet AA contrast ratio (4.5:1 for normal text) |

### Implementation Details

- Use native `<button>` elements for each item for semantic HTML
- Apply `aria-current="page"` to the currently selected item
- Add `aria-label` to the nav container: e.g., `aria-label="Main navigation"`
- Use `focus-visible` for focus indicators (keyboard only)
- Ensure disabled items are not keyboard-focusable

---

## VIII. Implementation Strategy

### Phase 1: Setup & Types
1. Create `Nav.types.ts` with all type definitions
2. Verify semantic tokens exist in `src/styles/tokens.css`
3. Create skeleton `Nav.tsx` with forwardRef wrapper

### Phase 2: Core Component Logic
1. Implement main Nav component with controlled + uncontrolled state
2. Implement internal NavItem sub-component
3. Add className merging via `cn()`
4. Add ARIA attributes and accessibility features
5. Set `displayName`

### Phase 3: Styling & Layout
1. Define Tailwind utility classes for all states
2. Apply semantic token Tailwind utilities
3. Test responsive behavior
4. Handle overflow/wrapping for many items

### Phase 4: Stories & Tests
1. Create Storybook stories for all variants
2. Create unit tests covering all states and interactions
3. Manual accessibility testing (keyboard navigation, screen reader)
4. Visual regression testing via Storybook

### Phase 5: Constitution & Quality Gates
1. Verify all 5 files exist
2. Verify no hardcoded colors or arbitrary Tailwind values
3. Verify `forwardRef`, `displayName`, `className` prop present
4. Pass all unit and accessibility tests
5. Storybook stories complete and documented

---

## IX. Controlled vs Uncontrolled Behavior

### Controlled Mode

The parent component manages state:

```tsx
const [selectedItem, setSelectedItem] = useState("home");

<Nav
  items={[...]}
  selected={selectedItem}
  onChange={(id) => setSelectedItem(id)}
/>
```

### Uncontrolled Mode

The component manages its own state:

```tsx
<Nav
  items={[...]}
  defaultSelected="home"
  onChange={(id) => console.log("Selected:", id)}
/>
```

### Implementation

- If `selected` prop is provided, use controlled mode
- If only `defaultSelected` is provided, manage internal state
- Always support `onChange` callback regardless of mode
- Cannot switch between modes after mount (React best practice)

---

## X. Example Component Skeleton

```tsx
import { forwardRef, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import type { NavProps, NavigationItem } from "./Nav.types";

const NavItem = forwardRef<
  HTMLButtonElement,
  {
    item: NavigationItem;
    isSelected: boolean;
    onChange: (id: string) => void;
  }
>(({ item, isSelected, onChange }, ref) => (
  <button
    ref={ref}
    onClick={() => onChange(item.id)}
    aria-current={isSelected ? "page" : undefined}
    disabled={item.disabled}
    className={cn(
      "flex flex-col items-center gap-1 px-4 py-2 transition-colors",
      isSelected
        ? "text-accent border-b-2 border-accent"
        : "text-ink-secondary hover:text-ink",
      item.disabled && "text-ink-disabled cursor-not-allowed opacity-50",
    )}
  >
    {typeof item.icon === "string" ? (
      <span>{item.icon}</span>
    ) : (
      <item.icon className="h-5 w-5" />
    )}
    <span className="text-xs">{item.label}</span>
  </button>
));

NavItem.displayName = "NavItem";

export const Nav = forwardRef<HTMLElement, NavProps>(
  (
    {
      items,
      selected: controlledSelected,
      defaultSelected,
      onChange,
      className,
      "aria-label": ariaLabel = "Navigation",
      ...props
    },
    ref,
  ) => {
    const [internalSelected, setInternalSelected] = useState(defaultSelected || items[0]?.id);
    const isControlled = controlledSelected !== undefined;
    const selected = isControlled ? controlledSelected : internalSelected;

    const handleSelect = (id: string) => {
      if (!isControlled) setInternalSelected(id);
      onChange?.(id);
    };

    return (
      <nav
        ref={ref}
        className={cn("flex bg-surface border-b border-line", className)}
        aria-label={ariaLabel}
        {...props}
      >
        {items.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            isSelected={selected === item.id}
            onChange={handleSelect}
          />
        ))}
      </nav>
    );
  },
);

Nav.displayName = "Nav";
```

---

## XI. Success Criteria & Checkpoints

### Before Implementation Starts

- [ ] Constitution.md reviewed and understood
- [ ] Semantic tokens verified in `src/styles/tokens.css`
- [ ] @radix-ui/react-primitive installed
- [ ] This plan.md reviewed and approved

### During Implementation

- [ ] All 5 files created under `src/components/ui/Nav/`
- [ ] No hardcoded colors or arbitrary Tailwind values
- [ ] `forwardRef`, `displayName`, `className` present
- [ ] TypeScript: no `any` types, strict mode compliant
- [ ] Controlled + uncontrolled modes both working

### Before Shipping

- [ ] All unit tests passing (Vitest)
- [ ] All Storybook stories complete
- [ ] WCAG 2.1 AA accessibility verified
- [ ] Keyboard navigation working (Tab, Space/Enter)
- [ ] Manual visual review of all three variants
- [ ] Constitution quality gates passed
- [ ] No token violations flagged

---

## XII. Dependencies Summary

### Existing (No Action Needed)

- React 19.2.5
- TypeScript 6.0.3
- Tailwind CSS 4.2.4
- Tailwindcss/vite 4.2.4
- class-variance-authority 0.7.1
- clsx 2.1.1
- tailwind-merge 3.5.0
- @radix-ui/react-slot 1.2.4
- lucide-react 1.11.0

### New to Install

- **@radix-ui/react-primitive** ^1.0.3

### Dev Dependencies (No Action Needed)

- Storybook 10.3.5
- Vitest 4.1.5
- Playwright 1.59.1

---

## XIII. Next Steps

1. **Validate Plan**: Review this plan.md for completeness
2. **Install Dependency**: Run `npm install @radix-ui/react-primitive`
3. **Start Implementation**: Begin with Phase 1 (types setup)
4. **Create Skeleton**: Create all 5 files with boilerplate
5. **Implement Core**: Build component logic following constitution
6. **Add Tests & Stories**: Create comprehensive test suite and Storybook stories
7. **Quality Review**: Run through all quality gates
8. **Commit & Merge**: Merge feature branch after approval

---

**Plan Version**: 1.0.0  
**Prepared**: May 2, 2026  
**Ready for Implementation**: ✅ Yes
