# Phase 1: Data Model — Combobox Component

**Completed**: 1 May 2026 | **Status**: Design finalized ✅

## Entity Definitions

### ComboboxOption

**Definition**: A single selectable item in the combobox dropdown.

```typescript
interface ComboboxOption {
  value: string; // Unique identifier for the option
  label: string; // Display text shown to user
  disabled?: boolean; // Optional: disable this option
  icon?: React.ReactNode; // Optional: icon to display before label
}
```

**Example**:

```typescript
const frameworkOptions: ComboboxOption[] = [
  { value: "nextjs", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];
```

**Validation Rules**:

- `value` must be unique within the options array
- `label` must not be empty
- `label` max 100 characters (for UI consistency)
- `disabled` defaults to false if not specified

---

### ComboboxState

**Definition**: Internal state managed by the component.

```typescript
interface ComboboxInternalState {
  isOpen: boolean; // Dropdown menu visibility
  selectedValue: string | undefined; // Currently selected option value
  highlightedIndex: number; // Index of currently keyboard-highlighted option
  searchValue: string; // Current search input value
  filteredOptions: ComboboxOption[]; // Options after filtering
}
```

**State Transitions**:

- **isOpen**:
  - `false` → `true` when user clicks input, presses arrow key, or types
  - `true` → `false` when user presses Escape, clicks outside, or selects an option
- **selectedValue**:
  - Updated when user presses Enter on a highlighted option
  - Fires `onChange` callback with new value
  - In controlled mode, updated by parent via prop

- **highlightedIndex**:
  - Arrow Up: `index - 1` (wrap to end if at start)
  - Arrow Down: `index + 1` (wrap to start if at end)
  - Type: reset to 0 (first filtered option)
  - Click option: move highlight to clicked item

- **searchValue**:
  - Updated character-by-character as user types in search field
  - Clears when menu is closed (or on prop-controlled `value` change)
  - Used to filter options

- **filteredOptions**:
  - Computed from `options` array using `filterFn` and `searchValue`
  - Default filter: case-insensitive substring match on label
  - Empty list if no matches (show "No options found" message)

---

## Component Props Interface

### ComboboxProps (Full Type)

```typescript
interface ComboboxProps extends React.ComponentPropsWithRef<"div"> {
  // State Management (choose one pattern)
  value?: string; // Controlled mode: current selected value
  defaultValue?: string; // Uncontrolled mode: initial value
  onChange?: (value: string) => void; // Required if `value` is set
  onOpenChange?: (open: boolean) => void; // Optional: open state callback

  // Options
  options?: ComboboxOption[]; // Array of selectable options
  placeholder?: string; // Placeholder text (default: "Select...")
  searchPlaceholder?: string; // Search input placeholder (default: "Search...")

  // Behavior
  disabled?: boolean; // Disable entire component
  readOnly?: boolean; // Allow reading but not changing
  filterFn?: (option: ComboboxOption, searchValue: string) => boolean; // Custom filter

  // Appearance
  size?: "sm" | "md" | "lg"; // Size variant (default: 'md')
  variant?: "default" | "outline"; // Visual variant (default: 'default')

  // Advanced
  asChild?: boolean; // Render as child element (Radix Slot pattern)
  renderOption?: (option: ComboboxOption) => React.ReactNode; // Custom option renderer
  renderValue?: (value: string) => React.ReactNode; // Custom display for selected value

  // Standard React props (inherited from ComponentPropsWithRef)
  className?: string; // Additional CSS classes
  style?: React.CSSProperties; // Inline styles (should be rare)
  // ... and all standard HTML div attributes
}
```

### Required Props (Runtime Validation)

1. **If `value` is defined**: `onChange` must also be defined.
   - Error: "Combobox: `onChange` is required when `value` is defined (controlled mode)"

2. **If `value` is defined**: `defaultValue` must NOT be defined.
   - Error: "Combobox: Cannot specify both `value` and `defaultValue` (use either controlled or uncontrolled mode)"

3. **options**: At least one option in the array (if provided).
   - Warning if empty: "Combobox: `options` array is empty. No items to select."

---

## State Management Patterns

### Pattern 1: Uncontrolled Mode

Parent doesn't manage selected value. Component manages it internally.

```typescript
<Combobox
  options={frameworkOptions}
  defaultValue="nextjs"
  onChange={(value) => console.log("Selected:", value)}
/>
```

**Internal State**:

- Component tracks `selectedValue` via `useState`
- Updates when user selects an option
- Fires `onChange` callback for parent to react

**Use Case**: Simple forms, one-off selections where parent doesn't need to control

---

### Pattern 2: Controlled Mode

Parent manages selected value via props. Component is a "dumb" UI layer.

```typescript
const [selected, setSelected] = useState<string>("nextjs");

return (
  <Combobox
    options={frameworkOptions}
    value={selected}
    onChange={setSelected}
  />
);
```

**Internal State**:

- Component updates local `highlightedIndex` and `searchValue` only
- `selectedValue` comes from parent via `value` prop
- Calls `onChange(newValue)` when user tries to select

**Use Case**: Complex forms, multi-field coordination, validation, undo/redo

---

## Validation Rules

### Option-Level Validation

```typescript
function validateOption(option: ComboboxOption): boolean {
  if (!option.value || typeof option.value !== "string") {
    console.error("ComboboxOption: `value` must be a non-empty string", option);
    return false;
  }
  if (!option.label || typeof option.label !== "string") {
    console.error("ComboboxOption: `label` must be a non-empty string", option);
    return false;
  }
  if (option.label.length > 100) {
    console.warn(
      "ComboboxOption: `label` exceeds 100 characters (truncating UI)",
      option,
    );
  }
  return true;
}
```

### Value Validation

```typescript
function validateValue(
  value: string | undefined,
  options: ComboboxOption[],
): boolean {
  if (value === undefined) return true; // Unset is valid
  const exists = options.some((opt) => opt.value === value);
  if (!exists) {
    console.warn("Combobox: `value` does not exist in options", {
      value,
      options,
    });
    return false; // But don't error—allow graceful fallback
  }
  return true;
}
```

---

## Keyboard Navigation State Machine

```
States: CLOSED, OPEN, SELECTING

CLOSED:
  - Click input → OPEN
  - Type (any key) → OPEN, highlightedIndex = 0, append to search
  - Focus input → CLOSED (ready state)

OPEN:
  - ArrowDown → highlightedIndex++
  - ArrowUp → highlightedIndex--
  - Enter → SELECTING
  - Escape → CLOSED
  - Type (letter/digit) → update searchValue, re-filter
  - Click option → SELECTING
  - Click outside → CLOSED

SELECTING:
  - Update selectedValue = highlightedOption.value
  - Fire onChange(selectedValue)
  - Clear searchValue
  - Go to CLOSED
```

---

## API & Composition

### Component Exports

```typescript
// index.ts
export { Combobox } from "./Combobox";
export type { ComboboxProps } from "./Combobox.types";
```

### forwardRef Implementation

```typescript
const Combobox = React.forwardRef<HTMLDivElement, ComboboxProps>(
  (props, ref) => {
    // Component implementation
    return <div ref={ref} {...props}>{/* content */}</div>;
  }
);

Combobox.displayName = "Combobox";
```

**Forward Ref Target**: Root `div` element wrapping the entire component. Allows parent to imperatively access the underlying DOM node (rarely needed, but supported).

---

## Design Tokens Used

All styling consumes the following design tokens via Tailwind utilities:

### Color Tokens

- `--color-background`: Input and option backgrounds
- `--color-border`: Borders
- `--color-foreground`: Primary text
- `--color-muted-foreground`: Placeholder and hint text
- `--color-accent`: Highlighted/selected option background
- `--color-accent-foreground`: Text on accent background
- `--color-popover`: Dropdown menu background
- `--color-popover-foreground`: Dropdown text
- `--color-destructive`: Delete/remove actions (if present)

### Spacing Tokens

- `--space-x-*`, `--space-y-*`: Gap between items
- `--px-*`, `--py-*`: Padding
- `--gap-*`: Flex gap

### Typography Tokens

- `--family/sans`: Font family (Inter)
- `--weight/normal`, `--weight/medium`, `--weight/semibold`: Font weights
- `--size/xs`, `--size/sm`, `--size/base`, `--size/4xl`: Font sizes
- `--leading/*`: Line heights

### Radius & Shadow Tokens

- `--radius-md`, `--radius-lg`: Border radii
- `--shadow-xs`, `--shadow-md`: Drop shadows

**No Hard-Coded Values**: All styling via token references. Example:

```tsx
// ❌ WRONG
<div className="bg-white text-black px-4 py-2 rounded-lg">

// ✅ CORRECT
<div className="bg-background text-foreground px-3 py-2 rounded-md">
```

---

## Error Handling

### Console Warnings (Non-Fatal)

- Missing `onChange` in controlled mode
- `value` does not exist in options
- Empty options array
- Invalid option shape (missing label/value)
- Label exceeding 100 characters

### Runtime Errors (Fatal)

- None. Component is defensive and degrades gracefully.

### User Feedback

- **No options**: "No options found" message in dropdown
- **Search empty**: Show all options
- **Invalid value**: Component ignores invalid value, shows placeholder

---

## Accessibility Mappings

| Requirement            | Implementation                                                |
| ---------------------- | ------------------------------------------------------------- |
| **Role**               | `combobox` on input, `listbox` on dropdown, `option` on items |
| **States**             | `aria-expanded`, `aria-selected`, `aria-disabled`             |
| **Labels**             | `aria-label` on search, visible labels via `label` element    |
| **Focus**              | Focus trap via Radix Popover, focus returns on close          |
| **Keyboard**           | Arrow keys, Enter, Escape all supported                       |
| **Disabled**           | `disabled` prop disables all interaction                      |
| **Contrast**           | Text/background meets WCAG AA (verify with axe-core)          |
| **Color Independence** | Checkmark icon + accent background (not color alone)          |

---

## Phase 1 Completion Checklist

✅ All entities defined  
✅ Props interface finalized  
✅ State machine documented  
✅ Validation rules specified  
✅ Keyboard navigation mapped  
✅ Design tokens identified  
✅ Error handling strategy defined  
✅ Accessibility requirements confirmed

**Next Step**: Generate `/tasks.md` with actionable implementation tasks.
