# Implementation Plan: NavBar Component

**Branch**: `002-navbar-component` | **Date**: 2 May 2026 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-navbar-component/spec.md`

**Note**: This plan focuses on data modeling (Phase 1 design) — TypeScript props, CVA variants, and state interfaces. Full implementation follows in Phase 2.

## Summary

**Requirement**: A flat-pattern React component rendering a bottom navigation bar with three fixed navigation items (Home, Search, Profile), each with an icon and label. The component accepts a `selected` prop to control which item displays in the active state, and emits a callback when a user clicks a navigation item. Must support keyboard navigation, ARIA accessibility, and mobile/responsive viewports.

**Technical Approach**:

- Flat component pattern (single export) per Constitution rule III
- Layer 2 semantic token styling exclusively (no hex values)
- Controlled mode via `selected` prop and `onSelect` callback
- Three hard-coded navigation items (Home, Search, Profile) with icon support
- Radix-based focus management and keyboard navigation (Tab, Arrow keys)
- Forward ref + className prop merged via `cn()` per Constitution rule II
- CVA (Class Variance Authority) for styling variants (none currently; reserved for future use)

## Technical Context

**Language/Version**: TypeScript 6 + React 19  
**Primary Dependencies**: Radix UI (primitives for focus/keyboard), Class Variance Authority (cva), clsx, tailwind-merge  
**Storage**: N/A  
**Testing**: Vitest + React Testing Library  
**Target Platform**: Web browser (ES2020+), mobile-first responsive  
**Project Type**: React component library (npm package)  
**Performance Goals**: Component mounts in <10ms, re-renders on prop change in <5ms  
**Constraints**: <3KB minified/gzipped, zero dependencies beyond Radix/CVA, WCAG 2.1 AA accessible  
**Scale/Scope**: Single component with three fixed navigation items; flat pattern; ~250 LOC implementation target

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

✅ **Semantic Tokens Only** — All styling via Tailwind utilities mapping to Layer 2 semantic tokens (`bg-surface`, `text-ink`, `border-accent`, `text-accent`, etc.). No hex/rgb/hsl, no arbitrary bracket notation, no inline `style` props for design properties.

✅ **Component API Contract** — Will use `forwardRef`, accept `className` merged last via `cn()`, set `displayName` explicitly. Props: `selected` (controlled), `onSelect` callback, and optional `asChild` for composition flexibility.

✅ **Flat vs Compound Pattern** — Flat pattern confirmed. NavBar renders as a single logical unit with three non-independently-composable navigation items. Consumers do not need to reorder or omit items; the component is a complete bottom navigation bar.

✅ **Radix UI for Accessibility** — Uses Radix `FocusScope` and/or manual keyboard event handling for Tab and Arrow key navigation between items. Each item has correct ARIA roles (`role="button"` or `role="tab"`), states (`aria-current="page"` for active), and labels. Focus indicators required and must meet AA contrast.

✅ **Pure-CSS Theming** — `data-theme="dark"` on `:root` toggles dark mode. All token overrides in CSS only, no JS theme switching.

## Project Structure

### Documentation (this feature)

```text
specs/002-navbar-component/
├── plan.md              # This file (implementation plan)
├── spec.md              # Feature specification
├── data-model.md        # Phase 1 output — TypeScript interfaces, state models, prop shapes
├── quickstart.md        # Phase 1 output — usage examples (to be created in Phase 1)
└── checklists/
    └── requirements.md  # Specification quality validation
```

### Source Code (repository root)

```text
src/
├── components/
│   └── ui/
│       └── NavBar/
│           ├── index.ts                    # Named exports
│           ├── NavBar.tsx                  # Component implementation
│           ├── NavBar.types.ts             # TypeScript interfaces (data-model)
│           ├── NavBar.stories.tsx          # Storybook stories
│           └── NavBar.test.tsx             # Unit + integration tests
├── styles/
│   ├── tokens.css                          # Layer 1 + Layer 2 semantic tokens
│   └── themes/
│       └── violet.css                      # Brand variant overrides (light + dark)
└── lib/
    └── utils.ts                            # cn() utility for class merging
```

**Structure Decision**: Single-component flat pattern. NavBar renders three navigation items as a horizontal flex container suitable for bottom navigation positioning. No sub-component exports. Styling uses semantic tokens from `src/styles/tokens.css` and Tailwind utilities mapped in `src/index.css`.

## Complexity Tracking

No Constitution violations anticipated. All patterns comply with Aurora design system rules:

- Semantic tokens only (Layer 2)
- forwardRef + displayName + className
- Flat pattern (no sub-components)
- Radix for accessibility primitives
- Pure CSS theming
