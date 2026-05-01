# Combobox Component — Public API Contract

**Version**: 1.0.0 | **Date**: 1 May 2026 | **Status**: Specification (Pre-Implementation)

This document defines the immutable public API contract for the Combobox component. Changes to this contract constitute breaking changes and require a major version bump.

---

## Component Export

### Named Export

```typescript
// ✅ CORRECT
import { Combobox } from "@aurora/ui";

// ❌ WRONG (default exports not permitted)
import Combobox from "@aurora/ui";
```

**Export Location**: `src/components/ui/Combobox/index.ts` → Package entry point via barrel export

### Type Exports

```typescript
import type { ComboboxProps, ComboboxOption } from "@aurora/ui";
```

---

## Props Contract

### ComboboxProps Interface

```typescript
interface ComboboxProps extends React.ComponentPropsWithRef<"div"> {
  // --- State Management (Controlled or Uncontrolled Mode) ---

  /**
   * Controlled mode: The currently selected option value.
   * When provided, `onChange` must also be provided.
   * Mutually exclusive with `defaultValue`.
   */
  value?: string;

  /**
   * Uncontrolled mode: The initial selected value.
   * Component manages state internally.
   * Mutually exclusive with `value`.
   */
  defaultValue?: string;

  /**
   * Callback fired when user selects a new option.
   * Required in controlled mode (when `value` is set).
   */
  onChange?: (value: string) => void;

  /**
   * Callback fired when dropdown open/closed state changes.
   * Useful for coordinating with parent layout or animations.
   */
  onOpenChange?: (open: boolean) => void;

  // --- Options & Content ---

  /**
   * Array of selectable options.
   * Each option must have a unique `value` and non-empty `label`.
   */
  options?: ComboboxOption[];

  /**
   * Placeholder text shown when no option is selected.
   * @default "Select..."
   */
  placeholder?: string;

  /**
   * Placeholder text for the search input field in the dropdown.
   * @default "Search..."
   */
  searchPlaceholder?: string;

  // --- Behavior ---

  /**
   * If true, the combobox cannot be interacted with.
   * All inputs ignored, visual disabled state applied.
   * @default false
   */
  disabled?: boolean;

  /**
   * If true, user cannot type or select, but can view options.
   * Similar to disabled but may have different visual treatment.
   * @default false
   */
  readOnly?: boolean;

  /**
   * Custom filter function for search/filtering logic.
   * Called for each option with the search value.
   * Return true to include option in filtered results.
   *
   * @default Case-insensitive substring match on label
   */
  filterFn?: (option: ComboboxOption, searchValue: string) => boolean;

  // --- Appearance ---

  /**
   * Size variant of the component.
   * @default 'md'
   */
  size?: "sm" | "md" | "lg";

  /**
   * Visual style variant.
   * @default 'default'
   */
  variant?: "default" | "outline";

  // --- Advanced (Composition & Customization) ---

  /**
   * Render as child element (Radix `asChild` / Slot pattern).
   * Allows wrapping the component with another element (e.g., router Link).
   * When true, component does NOT render a wrapper div;
   * instead it merges all props into the provided child element.
   * @default false
   * @see https://radix-ui.com/docs/primitives/guides/composition
   */
  asChild?: boolean;

  /**
   * Custom renderer for individual option elements.
   * Called for each option; return ReactNode to render.
   * If not provided, renders label with optional checkmark icon.
   */
  renderOption?: (option: ComboboxOption) => React.ReactNode;

  /**
   * Custom renderer for the selected value display in the closed state.
   * Called with the selected value string.
   * If not provided, renders the matching option's label.
   */
  renderValue?: (value: string) => React.ReactNode;

  // --- Standard React Props (via ComponentPropsWithRef<'div'>) ---

  /**
   * CSS class names (merged last via `cn()`, so consumer classes override).
   */
  className?: string;

  /**
   * Inline styles (avoid when possible; prefer Tailwind utilities).
   */
  style?: React.CSSProperties;

  /**
   * React ref forwarded to root wrapper div.
   * Rarely needed; supports imperative DOM access if required.
   */
  ref?: React.Ref<HTMLDivElement>;

  // ... all other standard HTML div attributes (data-*, aria-*, etc.)
}
```

### ComboboxOption Interface

```typescript
interface ComboboxOption {
  /**
   * Unique identifier for this option.
   * Used internally as the value when option is selected.
   * Must be a non-empty string.
   */
  value: string;

  /**
   * Display label shown to the user.
   * Rendered in dropdown list and as selected value (unless renderValue overrides).
   * Must be a non-empty string, recommended ≤ 100 characters.
   */
  label: string;

  /**
   * Optional: Disable this individual option.
   * Disabled options cannot be selected and show disabled styling.
   * @default false
   */
  disabled?: boolean;

  /**
   * Optional: Icon to display before the label.
   * Can be any React node (SVG icon component recommended).
   */
  icon?: React.ReactNode;
}
```

---

## Component Features & Guarantees

### forwardRef

**Guaranteed**: Component is wrapped in `React.forwardRef`. Ref is forwarded to the root wrapper element.

```typescript
const ref = useRef<HTMLDivElement>(null);
<Combobox ref={ref} options={options} />;
// ref.current is the root <div> element
```

### displayName

**Guaranteed**: Component has explicit `displayName` for debugging and testing.

```typescript
Combobox.displayName === "Combobox"; // ✅ true
```

### className Composition

**Guaranteed**: Accepts `className` prop; merged LAST via `cn()` (clsx + tailwind-merge). Consumer classes override internal defaults.

```typescript
<Combobox
  className="my-custom-class w-full"
  options={options}
/>
// Result: Internal styles + "my-custom-class w-full"
// If conflicts: consumer ("w-full") wins over internal
```

### State Management Patterns

**Guaranteed**: Both controlled and uncontrolled modes work correctly.

```typescript
// ✅ Uncontrolled
<Combobox defaultValue="nextjs" options={options} onChange={handleChange} />

// ✅ Controlled
const [value, setValue] = useState("nextjs");
<Combobox value={value} onChange={setValue} options={options} />

// ❌ Invalid: Both value and defaultValue
<Combobox value={value} defaultValue="nextjs" options={options} /> // ERROR
```

### Keyboard Navigation

**Guaranteed**: Full keyboard support for accessibility.

| Key        | Behavior                                   |
| ---------- | ------------------------------------------ |
| Arrow Down | Next option (wrap to first)                |
| Arrow Up   | Previous option (wrap to last)             |
| Enter      | Select highlighted option                  |
| Escape     | Close dropdown                             |
| Tab        | Focus away, close dropdown                 |
| Type       | Filter options, open dropdown if closed    |
| Space      | Select highlighted option (when menu open) |

### ARIA & Accessibility

**Guaranteed**: Component meets WCAG 2.1 AA minimum.

- Role attributes (`combobox`, `listbox`, `option`) present and correct
- State attributes (`aria-expanded`, `aria-selected`, `aria-disabled`) managed correctly
- Focus management and focus visible indicators present
- Keyboard navigation fully supported
- Screen reader announcements functional

**Verified By**: axe-core accessibility testing in test suite.

### Design Token Consumption

**Guaranteed**: All styling uses semantic design tokens via Tailwind utilities. No hard-coded colors, spacing, or arbitrary values.

**Tokens Consumed**:

- Color: `background`, `border`, `foreground`, `muted-foreground`, `accent`, `accent-foreground`, `popover`, `popover-foreground`
- Spacing: Gap, padding, margin tokens
- Typography: Font family, weight, size, line-height, letter-spacing
- Radius & Shadow: `radius-md`, `radius-lg`, `shadow-xs`, `shadow-md`

**Dark Mode**: Light/dark theme switching via `data-theme` attribute on `:root`.

### No Breaking Changes

**Guarantee After 1.0.0**: Props are immutable. No prop removals, no type narrowing without major version bump.

- New props can be added (always optional)
- Existing props kept forever
- Default values remain stable
- Return type of callbacks stable

---

## Composition Patterns (asChild & Slot)

### Default Rendering (asChild=false)

```typescript
<Combobox options={frameworks} defaultValue="nextjs" />
// Renders:
// <div class="combobox-root">
//   <div class="combobox-input">Select framework...</div>
//   [dropdown]
// </div>
```

### Composition via asChild=true

```typescript
import { Link } from 'react-router-dom';

<Combobox asChild options={frameworks}>
  <Link to={`/frameworks/${value}`}>
    {/* Combobox merges props into this Link */}
  </Link>
</Combobox>
// Renders:
// <Link class="combobox-root" ...combobox-props>
//   [combobox structure]
// </Link>
```

---

## Error Scenarios & Handling

### Invalid Props (Dev Mode Warnings)

The component validates props in development and logs warnings to console (does not crash):

1. **Missing onChange in controlled mode**

   ```
   Warning: Combobox: `onChange` is required when `value` is defined (controlled mode).
   ```

2. **Both value and defaultValue**

   ```
   Error: Combobox: Cannot specify both `value` and `defaultValue`. Choose either controlled or uncontrolled mode.
   ```

3. **Value not in options**

   ```
   Warning: Combobox: Selected value "invalid" does not exist in options.
   ```

4. **Empty options array**
   ```
   Warning: Combobox: `options` array is empty. User will see "No options available".
   ```

### Graceful Fallbacks

- If `value` is invalid (not in options): Component treats as unselected, shows placeholder
- If `options` is empty: Shows "No options available" message
- If `filterFn` throws error: Component logs error and shows unfiltered options

---

## Performance Characteristics

### Memory

- Component does not hold references beyond its own state
- No memory leaks with refs, callbacks, or event listeners
- Cleanup performed on unmount

### Rendering

- Memoization of expensive computations (filtering, option rendering)
- Re-renders only when props or internal state changes
- No unnecessary child re-renders

### Bundle Size

Target: < 15 KB gzipped (component + Radix dependency)

---

## Versioning & Stability

### Semantic Versioning

- **1.0.0**: Initial stable release. API is locked.
- **1.x.z**: Bug fixes, performance improvements, new optional props, internal refactors. No breaking changes.
- **2.0.0**: Only for breaking API changes (e.g., prop removal, type narrowing, behavior changes).

### Migration Path (1.x → 2.x)

- Migration guide provided
- Deprecation warnings issued in 1.x series
- Reasonable transition period (≥ 6 months)

---

## Testing Contract

### Unit Tests

- Controlled and uncontrolled modes both pass
- Keyboard navigation works
- Search/filter logic correct
- Props validation warnings logged
- > 80% code coverage

### Integration Tests

- Real DOM rendering
- User interactions (click, type, keyboard)
- Radix Popover integration
- Callbacks fired correctly

### Accessibility Tests

- axe-core scanning passes (WCAG 2.1 AA)
- No contrast violations
- Keyboard focus visible
- ARIA attributes correct
- Screen reader announcements (manual testing)

### Visual Tests

- Storybook stories for all variants
- Light and dark theme variants
- Different option list sizes
- Disabled and error states
- Responsive sizing (sm/md/lg)

---

## Deprecation Policy

When a feature or prop becomes outdated:

1. Prop marked `@deprecated` in JSDoc comments
2. Console warning in development (next minor version)
3. Documentation updated with migration advice
4. Prop continues to work (no immediate removal)
5. Removal scheduled for next major version (≥ 6 months later)

---

## Examples

### Basic Usage (Uncontrolled)

```typescript
import { Combobox } from '@aurora/ui';

const App = () => {
  const frameworks = [
    { value: 'nextjs', label: 'Next.js' },
    { value: 'sveltekit', label: 'SvelteKit' },
    { value: 'nuxt', label: 'Nuxt.js' },
  ];

  return (
    <Combobox
      options={frameworks}
      defaultValue="nextjs"
      placeholder="Select a framework"
      onChange={(value) => console.log('Selected:', value)}
    />
  );
};
```

### Controlled with React Hook Form

```typescript
import { useForm, Controller } from 'react-hook-form';
import { Combobox } from '@aurora/ui';

const App = () => {
  const { control } = useForm({ defaultValues: { framework: 'nextjs' } });

  return (
    <Controller
      name="framework"
      control={control}
      render={({ field: { value, onChange } }) => (
        <Combobox
          value={value}
          onChange={onChange}
          options={frameworks}
          placeholder="Pick a framework"
        />
      )}
    />
  );
};
```

### With Custom Filter

```typescript
const App = () => {
  return (
    <Combobox
      options={frameworks}
      filterFn={(option, search) => {
        // Match beginning of label only
        return option.label.toLowerCase().startsWith(search.toLowerCase());
      }}
    />
  );
};
```

---

## Contract Status

✅ **APPROVED** — Ready for implementation.

**Sign-off**: Design, Architecture, Accessibility Review completed.  
**Next Step**: Execute `/speckit.tasks` to generate actionable implementation tasks.
