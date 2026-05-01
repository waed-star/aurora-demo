# Feature Specification: Implement Combobox Component

**Branch**: `001-implement-figma-component` | **Date**: 1 May 2026 | **Status**: In Progress

## Summary

Implement a Combobox component — an autocomplete input combined with a command palette that provides filtering and selection from a list of suggestions. The component supports both controlled and uncontrolled states, keyboard navigation, and follows the Aurora design system conventions including semantic tokens, forwardRef API, and WCAG 2.1 AA accessibility standards.

## Feature Requirements

### Primary Capabilities

1. **Combobox Input**
   - Text input that accepts user typing to filter options
   - Displays placeholder "Select framework..." in default state
   - Shows selected value when an option is chosen
   - Chevron icon indicates collapsible state

2. **Dropdown Menu**
   - Appears below the input when activated
   - Contains search field with search icon for filtering options
   - List of selectable options (Next.js, SvelteKit, Nuxt.js, Remix, Astro)
   - Highlighted/selected state for current selection (Backlog status shown in design example)
   - Check icon indicator for selected item

3. **State Management**
   - **Default state**: Input shown, menu closed, chevron visible
   - **Open state**: Input shown above dropdown, full menu visible with search enabled
   - Support both controlled (`value` + `onChange`) and uncontrolled (`defaultValue`) patterns

4. **Keyboard Navigation**
   - Arrow Up/Down to navigate options
   - Enter to select highlighted option
   - Escape to close menu
   - Tab to move focus away
   - Type to filter/search options

### Design Specifications

- **Dimensions**: 200px width (combobox input), 36px height
- **Border radius**: `var(--radius-md, 8px)`
- **Spacing**: Uses design token gaps and padding (`px-3`, `py-2`)
- **Typography**:
  - Input text: Medium font-weight (500), 14px size
  - Placeholder: Regular (400), 14px, muted-foreground color
  - Dropdown items: Regular (400), 14px
- **Colors**: All consumed via semantic tokens (background, border, foreground, accent, popover, etc.)
- **Shadow**: Dropdown has shadow-md effect
- **Border**: Uses `var(--border, #e5e5e5)` with `var(--border-width, 1px)`

### Accessibility Requirements

- **WCAG 2.1 AA minimum**
- Keyboard support: all navigation and selection
- ARIA roles: `listbox`, `option`, `combobox`
- Proper focus management and visible focus indicators
- Search/filter accessible via keyboard
- Screen reader announcement of selected state

### API Contract

**Props Interface** (`ComboboxProps`):

```typescript
interface ComboboxProps extends React.ComponentPropsWithRef<"div"> {
  // State management
  value?: string; // Controlled: current selected value
  defaultValue?: string; // Uncontrolled: initial selected value
  onChange?: (value: string) => void; // Fires on selection change

  // Behavior
  options?: { value: string; label: string }[]; // List of selectable options
  placeholder?: string; // Default: "Select framework..."
  searchPlaceholder?: string; // Default: "Search framework"
  disabled?: boolean; // Disable the entire component

  // Appearance
  size?: "sm" | "md" | "lg"; // Default: 'md'

  // Advanced
  onOpenChange?: (open: boolean) => void;
  filterFn?: (option: any, searchValue: string) => boolean;
  renderOption?: (option: any) => React.ReactNode;
}
```

- **forwardRef** required — forward ref to wrapper div or input element
- **displayName** required — `Combobox.displayName = "Combobox"`
- **className** support — merged last via `cn()`
- **asChild** support (via Radix Slot) — allows rendering as any element (router Link, etc.)

## Design Files

- **Figma File**: [shadcn-ui-components-with-variables---Tailwind-classes---Updated-January-2026--Community---Copy](https://www.figma.com/design/kEUHJiKyyPxhVOapj2O5Dp)
- **Node ID**: 73:4708 (Combobox frame)
- **Related Nodes**:
  - 517:565 (Default state)
  - 517:564 (Open state)
  - Search, option items, selected state variations

## Constraints

- No hard-coded colors or spacing — all via design tokens
- Must support theming via CSS custom properties with light/dark mode
- TreeShake-able — no side effects
- Component must be backward compatible once released (semver)
- Must not introduce external dependencies beyond Radix UI for accessibility primitives

## Success Criteria

✓ Component renders both default and open states correctly  
✓ Keyboard navigation works (arrows, enter, escape)  
✓ Filtering/search reduces visible options  
✓ Selected item highlighted and shows checkmark  
✓ WCAG 2.1 AA passes (axe-core testing)  
✓ Controlled and uncontrolled patterns both work  
✓ All styles consumed from design tokens  
✓ Storybook stories created with variants  
✓ Unit tests achieve >80% coverage
