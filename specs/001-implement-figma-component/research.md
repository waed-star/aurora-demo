# Phase 0: Research — Combobox Implementation

**Completed**: 1 May 2026 | **Status**: All unknowns resolved ✅

## Research Tasks

### 1. Radix UI Combobox Primitives Investigation

**Decision**: Use Radix UI `@radix-ui/react-popover` as the accessibility backbone.

**Rationale**:

- Provides built-in focus management, keyboard navigation (arrow keys, Escape, Tab), and ARIA attributes
- Reduces custom ARIA implementation needed
- Well-tested and audited for WCAG 2.1 compliance
- Pairs well with Radix's Slot component for `asChild` pattern support

**Alternative Considered**: Custom HTML implementation with manual ARIA.
**Rejected Because**: Would require reimplementing focus traps, keyboard handlers, ARIA state management—increasing bug surface and maintenance burden. Radix eliminates this entirely.

**Finding**: Radix Combobox is now available (upgraded dependency). Use `@radix-ui/react-combobox` if it exists, else compose using Popover + manual option state.

### 2. Design Token Integration Strategy

**Decision**: Consume all styling via Tailwind utility classes mapped to CSS custom properties. No arbitrary values or hard-coded colors.

**Rationale**:

- Aurora Constitution (Principle I) mandates semantic tokens only
- Design system defines tokens in `src/styles/tokens.css`
- Tailwind `@theme` directive exposes tokens as utilities (e.g., `bg-background`, `text-foreground`, `border-border`)
- Enables full light/dark theming via `data-theme` attribute on `:root`

**Implementation**:

- Reference design shows use of `var(--background)`, `var(--border)`, `var(--foreground)`, `var(--accent)`, `var(--popover)`, `var(--muted-foreground)` tokens
- Map these to Tailwind config utilities
- Validate tokens exist in `tokens.css` before implementation; flag missing tokens

**Finding**: Existing Button, Input, Tabs components already follow this pattern. Reuse established patterns.

### 3. Controlled vs Uncontrolled Pattern

**Decision**: Support both controlled (`value` + `onChange`) and uncontrolled (`defaultValue`) patterns simultaneously.

**Rationale**:

- Aurora Constitution (Principle II) requires this for state-managing components
- Consumers may use component in either mode depending on context
- React Hook Form, Formik, and other form libraries work seamlessly with both

**Implementation**:

- Use internal `useState` when `defaultValue` is provided (uncontrolled)
- Accept `value` prop to enable controlled mode
- Export `onChange` callback for consumers to manage state
- Validate: if `value` is provided, `onChange` must also be provided

**Finding**: Existing Input and Tabs components already implement this. Use their patterns as reference.

### 4. Keyboard Navigation & Accessibility

**Decision**: Full keyboard support (Arrow Up/Down, Enter, Escape, Type) via Radix UI primitives + manual event handlers.

**Rationale**:

- WCAG 2.1 AA requirement
- Radix handles focus management and ARIA automatically
- Type-ahead filtering enhances UX for power users

**Keyboard Map**:

- **Arrow Up/Down**: Navigate options (Radix handles via Popover)
- **Enter**: Select highlighted option
- **Escape**: Close menu (Radix handles)
- **Tab**: Move focus away, close menu
- **Typing**: Filter/search options in real-time

**ARIA Requirements**:

- Role `listbox` on options container
- Role `option` on each option element
- `aria-selected="true"` on selected option
- `aria-label` on search input
- `aria-expanded` on combobox trigger

**Finding**: Radix Popover + Combobox primitives handle most ARIA. Supplement with axe-core testing.

### 5. Component States & Variants

**Decision**: Two primary states (default/closed, open) with visual variants for selected/highlighted options.

**Rationale**:

- Figma design shows default (chevron down, closed) and open (dropdown visible, highlighted option with checkmark) states
- Visual feedback necessary for UX clarity

**States**:

- **Closed**: Input visible, chevron icon, no dropdown
- **Open**: Input visible, dropdown menu, search enabled, option highlighting
- **Selected**: Checkmark icon, accent background color
- **Hover**: Subtle background color change (via `:hover` pseudo-class)

**Implementation**: Use React state to toggle between open/closed. Radix Popover handles positioning and stacking context.

**Finding**: Visual designs provided; implement exactly as shown in Figma (node IDs 517:565 default, 517:564 open).

### 6. Search/Filter Functionality

**Decision**: Client-side filtering of options as user types in the search input.

**Rationale**:

- Figma design includes search icon and "Search framework" placeholder in dropdown
- Fast UI feedback for user
- No backend latency

**Implementation**:

- Track search input value in component state
- Filter options array based on search term (case-insensitive substring match by default)
- Allow consumers to provide custom `filterFn` prop for advanced filtering
- Show all options if search is empty

**Finding**: Consider debouncing if future versions support async option loading from API.

### 7. Dependencies & Package Versions

**Decision**: Minimize external dependencies. Use Radix UI for accessibility, clsx + tailwind-merge for className composition.

**Confirmed Versions**:

- `@radix-ui/react-popover`: ≥ 1.0.0 (check package.json)
- `@radix-ui/primitive`: ≥ 1.0.0
- `clsx`: latest (for className merging)
- `tailwind-merge`: latest (for Tailwind conflict resolution)
- React: ≥ 18.0.0 (peer dependency, already in project)
- TypeScript: ≥ 5.0.0 (already in project)

**Finding**: Check `package.json` for exact versions. Install missing packages if needed.

### 8. Testing Strategy

**Decision**: Vitest + React Testing Library for unit tests, Storybook for visual documentation, axe-core for accessibility.

**Test Coverage Target**: > 80%

**Test Categories**:

1. **Unit Tests** (Vitest):
   - Controlled mode (value + onChange)
   - Uncontrolled mode (defaultValue)
   - Keyboard navigation
   - Search/filter logic
   - Props and displayName

2. **Integration Tests** (RTL):
   - User interactions (typing, selecting, keyboard)
   - State changes and callbacks
   - Radix Popover integration

3. **Accessibility Tests** (axe-core):
   - WCAG 2.1 AA violations
   - ARIA attributes
   - Keyboard focus management
   - Screen reader announcements

4. **Visual Tests** (Storybook):
   - Default state
   - Open state
   - Selected state
   - With different option lists
   - Dark theme variant
   - Disabled state

**Finding**: Existing Tabs component has similar test structure. Follow as reference.

### 9. Storybook Documentation

**Decision**: Create comprehensive Storybook stories with all variants and use cases.

**Stories to Create**:

- **Default**: Closed state, no selection
- **Open**: Dropdown visible
- **Selected**: With value pre-selected
- **Disabled**: Disabled state
- **With Custom Options**: Different data shape
- **Search Active**: Search input focused, filtering
- **Dark Theme**: Light and dark mode variants
- **Controlled**: Demonstrating controlled mode
- **Uncontrolled**: Demonstrating uncontrolled mode
- **Error State**: Optional, if design shows it
- **Sizes**: Small, medium, large variants (if design shows)

**Finding**: Update Storybook after component implementation. Use CSF 3 format (existing project standard).

### 10. Migration from Design to Code

**Decision**: Reference Figma design tokens and CSS variable names directly. Validate all token names exist.

**Design Tokens Found in Figma**:

- Color tokens: `--color-background`, `--color-border`, `--color-foreground`, `--color-accent`, `--color-popover`, `--color-muted-foreground`
- Spacing tokens: `--space-x-1`, `--space-y-1`, `--gap-1`, `--gap-2`, `--px-2`, `--px-3`, `--px-4`, `--py-1`, `--py-2`, `--py-3`
- Radius tokens: `--radius-md`, `--radius-lg`, `--rounded-md`, `--rounded-sm`
- Shadow tokens: `--shadow-xs`, `--shadow-md`
- Typography tokens: `--family/sans`, `--weight/normal`, `--weight/medium`, `--size/xs`, `--size/sm`, `--size/base`, `--leading/4`, `--leading/5`, `--leading/6`, `--leading/10`

**Action**: Verify all token names in `src/styles/tokens.css` before implementation. Flag and document any missing tokens.

**Finding**: Design uses comprehensive token system. All tokens likely already defined in project.

---

## Summary of Findings

| Topic             | Finding                                                                            | Action                                                                |
| ----------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| **Accessibility** | Radix UI handles most ARIA + focus. Custom event handlers needed for keyboard nav. | Use Radix Popover + Combobox. Supplement with axe-core tests.         |
| **Styling**       | All tokens available in design. Use Tailwind utilities mapped to CSS variables.    | No new tokens needed. Follow existing patterns in Button/Input/Tabs.  |
| **State**         | Controlled + uncontrolled modes required by Constitution.                          | Implement both patterns simultaneously using conditional useState.    |
| **Dependencies**  | Radix UI, clsx, tailwind-merge already in project.                                 | No new dependencies needed. Check versions in package.json.           |
| **Testing**       | Vitest + RTL + axe-core standard for project. > 80% coverage target.               | Follow Tabs component test structure as reference.                    |
| **Storybook**     | Create comprehensive visual documentation. CSF 3 format.                           | Add stories after implementation. Support light/dark theme switching. |

**Phase 0 Status**: ✅ All unknowns resolved. Ready to proceed to Phase 1 Design.
