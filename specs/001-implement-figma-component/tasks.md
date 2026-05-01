# Implementation Tasks: Implement Combobox Component

**Feature**: Implement Combobox Component from Figma Design  
**Branch**: `001-implement-figma-component`  
**Status**: Ready for Implementation  
**Date**: 1 May 2026

---

## Overview

This document contains actionable, dependency-ordered implementation tasks for building the Combobox component. Tasks are organized by phase and user story. Each task includes:
- **Checkbox**: Track completion status
- **Task ID**: Unique identifier (T001, T002, etc.)
- **[P] marker**: Parallelizable tasks (independent files, no blocking dependencies)
- **File paths**: Exact files to create/edit
- **Acceptance criteria**: How to verify the task is complete

**Total Tasks**: 24  
**Estimated Duration**: 8-10 hours  
**Parallel Opportunities**: 18 tasks can run in parallel (marked with [P])  
**MVP Scope**: Phase 1 + Phase 2 + Phase 3.1-3.5 (core component only; tests deferred to Phase 4)

---

## Phase 1: Setup & Project Initialization

*Goal*: Ensure project structure and dependencies are in place.  
*Duration*: 15 minutes  
*Independent Test Criteria*: Directory structure created, package.json verified, no errors on import.

### Setup Tasks

- [ ] T001 Create Combobox component directory structure in `src/components/ui/Combobox/`
  - Create: `src/components/ui/Combobox/`
  - Create empty files: `index.ts`, `Combobox.tsx`, `Combobox.types.ts`, `Combobox.stories.tsx`, `Combobox.test.tsx`, `Combobox.a11y.test.tsx`
  - **Verification**: `ls -la src/components/ui/Combobox/` shows all 6 files

- [ ] T002 Verify Radix UI and required dependencies in `package.json`
  - Check presence of: `@radix-ui/react-popover`, `@radix-ui/primitive`, `clsx`, `tailwind-merge`
  - If missing: Install via `npm install @radix-ui/react-popover` (others should exist)
  - **Verification**: `npm list @radix-ui/react-popover` returns a version, no errors

---

## Phase 2: Foundational — TypeScript Types & Scaffolding

*Goal*: Define component API surface and create scaffolding.  
*Duration*: 30 minutes  
*Independent Test Criteria*: `npm run type-check` passes, component exports successfully, types accurate.

### Foundational Tasks

- [ ] T003 [P] Create `Combobox.types.ts` with TypeScript interfaces
  - File: `src/components/ui/Combobox/Combobox.types.ts`
  - Define: `ComboboxProps`, `ComboboxOption`, `ComboboxInternalState` interfaces
  - Include JSDoc comments for all props
  - Reference: `/specs/001-implement-figma-component/contracts/combobox.md`
  - **Acceptance**: `npm run type-check` passes, TypeScript definitions comprehensive

- [ ] T004 [P] Create component scaffolding in `Combobox.tsx`
  - File: `src/components/ui/Combobox/Combobox.tsx`
  - Implement:
    - `forwardRef` wrapper with `React.ComponentPropsWithRef<'div'>`
    - `displayName = "Combobox"`
    - Prop interface import from `Combobox.types.ts`
    - Empty render function (returns minimal div for now)
  - **Acceptance**: File compiles, no TS errors, `displayName` set correctly

- [ ] T005 [P] Create `index.ts` named export (tree-shakeable)
  - File: `src/components/ui/Combobox/index.ts`
  - Export: `export { Combobox } from './Combobox';`
  - Export: `export type { ComboboxProps, ComboboxOption } from './Combobox.types';`
  - **Acceptance**: Can import `{ Combobox }` from component, types available

- [ ] T006 [P] Validate design tokens exist in `src/styles/tokens.css`
  - Check for tokens used in Figma design:
    - Colors: `--color-background`, `--color-border`, `--color-foreground`, `--color-accent`, `--color-popover`, `--color-muted-foreground`
    - Spacing: `--px-2`, `--px-3`, `--px-4`, `--py-1`, `--py-2`, `--gap-1`, `--gap-2`
    - Typography: `--size-sm`, `--size-base`, `--weight-normal`, `--weight-medium`
    - Radius/Shadow: `--radius-md`, `--shadow-md`
  - **Acceptance**: All tokens present; if missing, document in `MISSING_TOKENS.md` for later addition
  - **Note**: If tokens missing, flag for team discussion—do not invent new tokens

---

## Phase 3: User Story US1 — Implement Combobox Component

*Goal*: Implement fully functional Combobox component with all features.  
*Duration*: 4-5 hours  
*Independent Test Criteria*: Component renders, keyboard nav works, search filters options, controlled/uncontrolled modes both functional, Storybook displays all variants.

### US1 Task Group: Core Component Logic

- [ ] T007 Implement state management in `Combobox.tsx` (uncontrolled mode)
  - Features:
    - Track `selectedValue`, `isOpen`, `highlightedIndex`, `searchValue`, `filteredOptions` via `useState`
    - Use `defaultValue` prop for initial selection
    - Call `onChange` callback when selection changes
    - Open dropdown on input click or typing
  - **Acceptance**: `npm run storybook` → Story shows selected value updating, onChange fires in console

- [ ] T008 Implement controlled mode support in `Combobox.tsx`
  - Features:
    - Accept `value` prop; update internal state when `value` prop changes
    - Accept `onChange` callback; call it on selection (parent updates `value`)
    - Validate: if `value` provided, `onChange` must be provided (console warning if not)
    - Validate: cannot have both `value` and `defaultValue`
  - **Acceptance**: Controlled mode story in Storybook works; parent state controls component

- [ ] T009 [P] Implement Radix Popover integration for dropdown positioning
  - File: `src/components/ui/Combobox/Combobox.tsx`
  - Features:
    - Use `@radix-ui/react-popover` for dropdown
    - `<Popover.Root>` with `open` and `onOpenChange` state
    - `<Popover.Trigger>` for input wrapper
    - `<Popover.Content>` for dropdown menu
    - Proper focus management (focus returns to trigger on close)
  - **Acceptance**: Dropdown appears/disappears correctly, positions correctly, no focus issues

- [ ] T010 [P] Implement search/filter functionality
  - File: `src/components/ui/Combobox/Combobox.tsx`
  - Features:
    - Track `searchValue` state
    - Filter `options` array as user types in search field
    - Default filter: case-insensitive substring match on label
    - Allow custom `filterFn` prop override
    - Show "No options found" when search yields no results
  - **Acceptance**: Type in search field → options filter in real-time, custom filter works

- [ ] T011 [P] Implement keyboard navigation (arrow keys, enter, escape)
  - File: `src/components/ui/Combobox/Combobox.tsx`
  - Features:
    - **Arrow Up**: Move `highlightedIndex` up (wrap to end)
    - **Arrow Down**: Move `highlightedIndex` down (wrap to start)
    - **Enter**: Select highlighted option, call `onChange`, close menu
    - **Escape**: Close menu without selecting
    - **Tab**: Close menu, move focus away
    - **Type**: Open menu if closed, add to search value, reset highlight to 0
  - **Acceptance**: Storybook interactive test: navigate with arrows, select with Enter, close with Escape

- [ ] T012 [P] Implement styling via design tokens (Tailwind utilities)
  - File: `src/components/ui/Combobox/Combobox.tsx`
  - Features:
    - Input wrapper: `bg-background`, `border-border`, `text-foreground`, `rounded-md`, `px-3`, `py-2`
    - Dropdown: `bg-popover`, `border-border`, `shadow-md`, `rounded-md`
    - Search input: `placeholder-muted-foreground`
    - Options: `hover:bg-accent`, `:selected` with `bg-accent text-accent-foreground`
    - All spacing, colors, typography via tokens (no arbitrary Tailwind values)
  - **Acceptance**: Component visually matches Figma design; Light/Dark theme switching works via `data-theme`

- [ ] T013 [P] Add chevron icon and visual feedback
  - File: `src/components/ui/Combobox/Combobox.tsx`
  - Features:
    - Chevron icon (chevron-down) shown in default state
    - Icon rotates/changes on open state (optional animation)
    - Search icon shown in search field (within dropdown)
    - Check icon shown on selected option
    - All icons from lucide-react or existing project icon library
  - **Acceptance**: Icons appear in correct positions, rotate/animate on state change

- [ ] T014 [P] Implement accessibility (ARIA attributes, roles)
  - File: `src/components/ui/Combobox/Combobox.tsx`
  - Features:
    - Root: `role="combobox"`, `aria-expanded={isOpen}`, `aria-controls="listbox"`
    - Dropdown: `role="listbox"`, `id="listbox"`
    - Options: `role="option"`, `aria-selected={selected}`, `aria-disabled={disabled}`
    - Search input: `aria-label="Search options"` or similar
    - Focus management via Radix Popover (already handled)
  - **Acceptance**: axe-core scan passes WCAG 2.1 AA (in T019 a11y tests)

### US1 Task Group: Options & Customization

- [ ] T015 [P] Implement `renderOption` and `renderValue` customization props
  - File: `src/components/ui/Combobox/Combobox.tsx`
  - Features:
    - `renderOption` prop: custom renderer for each option (falls back to label if not provided)
    - `renderValue` prop: custom display for selected value in closed state
    - Both props optional; graceful fallback to defaults
  - **Acceptance**: Storybook story with custom renderers shows custom content

- [ ] T016 [P] Implement `size` and variant props
  - File: `src/components/ui/Combobox/Combobox.tsx`
  - Features:
    - `size`: 'sm' | 'md' | 'lg' (default: 'md')
      - sm: smaller padding, smaller text, smaller dropdown
      - md: standard
      - lg: larger padding, larger text, larger dropdown
    - `variant`: 'default' | 'outline' (default: 'default')
      - default: filled input with background
      - outline: transparent background, border-only style
  - **Acceptance**: Storybook stories show all size/variant combinations

- [ ] T017 [P] Implement `disabled` and `readOnly` behavior
  - File: `src/components/ui/Combobox/Combobox.tsx`
  - Features:
    - `disabled`: No interaction, grayed out styling, ARIA disabled
    - `readOnly`: Can view options but cannot select, similar visual to disabled but semantically different
    - Both prevent `onChange` from firing
  - **Acceptance**: Disabled/readonly options do not respond to clicks or keyboard

---

## Phase 4: Tests & Documentation

*Goal*: Ensure component is tested, documented, and verified for accessibility.  
*Duration*: 3-4 hours  
*Independent Test Criteria*: > 80% code coverage, all tests pass, no a11y violations, Storybook renders all variants.

### Test Tasks

- [ ] T018 Write unit tests in `Combobox.test.tsx`
  - File: `src/components/ui/Combobox/Combobox.test.tsx`
  - Test Suite 1: State Management
    - Uncontrolled mode: `defaultValue` sets initial value
    - Controlled mode: `value` prop controls selection
    - `onChange` fires on selection
    - Invalid props validation (value + defaultValue together → warning)
  - Test Suite 2: Keyboard Navigation
    - Arrow Up/Down navigate options
    - Enter selects highlighted option
    - Escape closes menu
    - Tab closes menu
    - Type filters options
  - Test Suite 3: Search/Filter
    - Default filter works (case-insensitive substring)
    - Custom `filterFn` works
    - "No options found" message appears when needed
  - Test Suite 4: Props
    - `displayName` is correct
    - `className` is merged and applied
    - `disabled` prevents interaction
    - `renderOption` and `renderValue` work
  - **Acceptance**: `npm run test -- Combobox.test.tsx` → All tests pass, > 80% coverage

- [ ] T019 [P] Write accessibility tests in `Combobox.a11y.test.tsx`
  - File: `src/components/ui/Combobox/Combobox.a11y.test.tsx`
  - Test Suite 1: axe-core scan (WCAG 2.1 AA)
    - No color contrast violations
    - No missing ARIA attributes
    - No invalid role usage
  - Test Suite 2: Keyboard Accessibility
    - All interactive elements reachable via Tab
    - Focus visible indicators present
    - Keyboard navigation fully functional
  - Test Suite 3: Screen Reader
    - Announce component role
    - Announce open/closed state changes
    - Announce selected option
  - **Acceptance**: `npm run test -- Combobox.a11y.test.tsx` passes, axe-core reports 0 violations

- [ ] T020 [P] Create Storybook stories in `Combobox.stories.tsx`
  - File: `src/components/ui/Combobox/Combobox.stories.tsx`
  - Stories to Create (CSF 3 format):
    - **Default**: Closed state, no selection, placeholder visible
    - **Open**: Dropdown visible, search enabled
    - **WithValue**: Pre-selected option shown
    - **Disabled**: Cannot interact
    - **ReadOnly**: Can view, cannot select
    - **CustomOptions**: Different data format (with icons, etc.)
    - **SearchActive**: Cursor in search field
    - **NoResults**: Search with no matching options
    - **Controlled**: Parent manages state (interactive demo)
    - **Uncontrolled**: Component manages state (interactive demo)
    - **Sizes**: sm / md / lg variants
    - **Variants**: default / outline
    - **DarkTheme**: Light and dark mode rendering
  - **Acceptance**: `npm run storybook` loads → All stories render without errors, interactions work

### Documentation Tasks

- [ ] T021 [P] Update project documentation
  - Files to update:
    - `README.md`: Add Combobox to component list
    - `src/components/ui/Combobox/README.md` (new): Quick component usage guide
  - Content:
    - Basic usage example (uncontrolled)
    - Controlled usage example
    - Props documentation (link to Storybook)
    - Accessibility notes
    - Dark mode support note
  - **Acceptance**: README is clear and useful; new users can understand component from docs

---

## Phase 5: Polish & Cross-Cutting Concerns

*Goal*: Ensure code quality, performance, and project health.  
*Duration*: 1-2 hours  
*Independent Test Criteria*: All checks pass, no lint errors, no type errors, bundle size acceptable.

### Polish Tasks

- [ ] T022 Run TypeScript type checking and linting
  - Commands:
    ```bash
    npm run type-check        # TypeScript check
    npm run lint              # ESLint
    npm run format:check      # Prettier
    npm run format            # Auto-format if needed
    ```
  - **Acceptance**: No errors, all warnings resolved or documented

- [ ] T023 Verify bundle size and tree-shakability
  - Commands:
    ```bash
    npm run build             # Build library
    # Check dist/Combobox.js size (should be < 15KB gzipped with dependencies)
    ```
  - **Acceptance**: Component < 15KB, tree-shaking works (no side effects in module graph)

- [ ] T024 Final visual verification in light and dark themes
  - Verification:
    - Open Storybook: `npm run storybook`
    - Toggle theme (if Storybook has theme switch) or manually change `data-theme`
    - Verify component matches Figma design in both light and dark modes
    - Check all variants: sizes, disabled, readonly, search active, etc.
  - **Acceptance**: Visual match to Figma, no visual regressions, responsive

---

## Task Dependencies & Parallelization

### Dependency Graph

```
T001, T002 (Setup)
    ↓
T003, T004, T005, T006 (Scaffolding) [parallel]
    ↓
T007 (Core state, blocking)
    ↓
T008, T009, T010, T011, T012, T013, T014, T015, T016, T017 (Component features) [parallel with T008]
    ↓
T018, T019, T020, T021 (Tests & docs) [parallel]
    ↓
T022, T023, T024 (Polish) [parallel]
```

### Recommended Parallel Execution

**Batch 1** (5 min):
- T001, T002 (sequential: need structure before checking deps)

**Batch 2** (30 min, parallel):
- T003, T004, T005, T006 (all independent: types, scaffolding, exports, token validation)

**Batch 3** (2 hours, sequential → then parallel):
- T007 (core state management - must come first)
- Then parallel: T008 (controlled mode), T009 (Popover), T010 (search), T011 (keyboard), T012 (styling), T013 (icons), T014 (a11y), T015 (customization), T016 (size/variant), T017 (disabled)

**Batch 4** (2 hours, parallel):
- T018, T019, T020, T021 (tests, stories, docs - independent)

**Batch 5** (1 hour, parallel):
- T022, T023, T024 (final checks, verification)

**Total Wall-Clock Time with Parallelization**: ~4 hours (sequential steps) vs ~8-10 hours (all sequential)

---

## MVP Scope (Minimum Viable Product)

If time is limited, complete tasks in this order to have a shippable MVP:

1. T001-T006 (Setup & scaffolding)
2. T007-T008 (State management: controlled + uncontrolled)
3. T009-T014 (Core UI: Popover, search, keyboard, styling, a11y, icons)
4. T020 (Storybook stories for documentation)
5. T022 (Type checking and linting)

**MVP Criteria**: Component renders, keyboard nav works, both state patterns work, WCAG 2.1 AA compliant, documented in Storybook.

**Nice-to-Have** (Phase 2 if time remains): T015-T017 (customization), T018-T019 (full test coverage), T021 (README), T023-T024 (bundle optimization).

---

## Testing Strategy

### Unit Tests (T018)
- Test component props, state changes, callbacks
- Use Vitest + React Testing Library
- Aim for > 80% code coverage
- Focus: Logic, not visual rendering

### Accessibility Tests (T019)
- Run axe-core to scan for WCAG violations
- Manual screen reader testing (or RTL queries that simulate screen reader)
- Keyboard navigation verification
- Focus management testing

### Visual Tests (T020 Storybook)
- Stories document all component states and variants
- Visual regression testing optional (external tool)
- Interactive testing in Storybook UI

### Integration Tests (as needed)
- Component integration with forms (React Hook Form, Formik)
- Multi-component interactions if relevant

---

## Acceptance Criteria Summary

### Per-Task Verification
- ✅ Each task has clear "Acceptance Criteria" section
- ✅ All tasks compile without TypeScript errors
- ✅ All keyboard interactions work as documented
- ✅ Component visually matches Figma design
- ✅ WCAG 2.1 AA passes axe-core scan
- ✅ Tests pass with > 80% coverage
- ✅ Storybook renders all variants

### End-of-Feature Verification
- ✅ Component exports as named export (`import { Combobox }`)
- ✅ forwardRef works (`ref` prop applied to DOM)
- ✅ displayName set (`Combobox.displayName === "Combobox"`)
- ✅ className composition works (consumer classes override)
- ✅ Controlled and uncontrolled modes both work
- ✅ Keyboard nav fully functional
- ✅ Search/filter works
- ✅ All styling from design tokens (no hard-coded colors/spacing)
- ✅ Light and dark theme both render correctly
- ✅ Bundle size < 15KB gzipped
- ✅ No lint or type errors
- ✅ > 80% test coverage
- ✅ Documented in Storybook and README

---

## Post-Implementation Checklist

After all tasks complete:

- [ ] Run full test suite: `npm run test`
- [ ] Run type check: `npm run type-check`
- [ ] Run linter: `npm run lint`
- [ ] Build Storybook: `npm run build:storybook`
- [ ] Build library: `npm run build`
- [ ] Verify bundle size: `ls -lh dist/` (should show reasonable sizes)
- [ ] Test in browser: Open Storybook locally, interact with component
- [ ] Create PR with clear description linking to spec and tasks
- [ ] Have team review (design, a11y, code review)
- [ ] Merge to main branch
- [ ] Tag release (if publishing to npm)

---

## Next Steps

1. ✅ Plan complete (all phase documentation created)
2. ⬜ **You are here**: Tasks generated
3. ⬜ **Next**: Start with T001 (create directory structure)
4. ⬜ Follow task order; parallelize where indicated
5. ⬜ Use Storybook for visual feedback during development
6. ⬜ Run tests frequently to catch issues early
7. ⬜ Use Figma design as reference; ensure pixel accuracy where appropriate

---

**Questions?** Refer to:
- `/specs/001-implement-figma-component/quickstart.md` — Development setup and workflow
- `/specs/001-implement-figma-component/contracts/combobox.md` — Component API specification
- `/specs/001-implement-figma-component/data-model.md` — Data structures and state machine

**Ready?** Begin with **T001**: `mkdir -p src/components/ui/Combobox && cd src/components/ui/Combobox && touch index.ts Combobox.tsx Combobox.types.ts Combobox.stories.tsx Combobox.test.tsx Combobox.a11y.test.tsx`
