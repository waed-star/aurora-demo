# Implementation Plan: SearchSection Component

**Branch**: `001-search-section-component` | **Date**: 2 May 2026 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-search-section-component/spec.md`

**Note**: This plan focuses on data modeling (Phase 1 design) — TypeScript props, CVA variants, and state interfaces. Full implementation follows in Phase 2.

## Summary

**Requirement**: A flat-pattern React component rendering three sections (search input, filter tabs, result count) with Active/Inactive variants and support for both controlled and uncontrolled modes with callbacks for search and filter changes.

**Technical Approach**:

- Flat component pattern (no sub-component composition) per Constitution rule III
- Layer 2 semantic token styling exclusively (no hex values)
- Support controlled (`searchValue`/`onSearchChange` + `activeFilter`/`onFilterChange`) and uncontrolled modes (`defaultSearchValue`/`defaultActiveFilter`)
- CVA (Class Variance Authority) for two variants: `active` (Yes/No)
- Forward ref + className prop merged via `cn()` per Constitution rule II

## Technical Context

**Language/Version**: TypeScript 6 + React 19  
**Primary Dependencies**: Radix UI (primitives), Class Variance Authority (cva), clsx, tailwind-merge  
**Storage**: N/A  
**Testing**: Vitest + React Testing Library  
**Target Platform**: Web browser (ES2020+)  
**Project Type**: React component library (npm package)  
**Performance Goals**: Component mounts in <10ms, re-renders on prop change in <5ms  
**Constraints**: <5KB minified/gzipped, zero dependencies beyond Radix/CVA, WCAG 2.1 AA accessible  
**Scale/Scope**: Single component with three logical sections; flat pattern; ~200 LOC implementation target

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

✅ **Semantic Tokens Only** — All styling via Tailwind utilities mapping to Layer 2 semantic tokens (`bg-surface`, `text-ink`, `border-accent`, etc.). No hex/rgb/hsl, no arbitrary bracket notation, no inline `style` props for design properties.

✅ **Component API Contract** — Will use `forwardRef`, accept `className` merged last via `cn()`, set `displayName` explicitly. Controlled and uncontrolled modes both supported.

✅ **Flat vs Compound Pattern** — Flat pattern confirmed (searchValue/activeFilter + callbacks) — component renders as single logical unit with no independently composable sub-components that consumers would reorder/omit.

✅ **Radix UI for Accessibility** — Filter tabs managed via Radix Tabs primitive for focus/keyboard/ARIA. Search input uses native HTML `<input>` with manual ARIA. Full keyboard nav + focus indicators required.

✅ **Pure-CSS Theming** — `data-theme="dark"` on `:root` toggles dark mode. All token overrides in CSS only, no JS theme switching.

## Project Structure

### Documentation (this feature)

```text
specs/001-search-section-component/
├── plan.md              # This file (implementation plan)
├── spec.md              # Feature specification
├── data-model.md        # Phase 1 output — TypeScript interfaces, CVA shapes, state models
├── quickstart.md        # Phase 1 output — usage examples
└── contracts/           # (N/A for component library — internal use only)
```

### Source Code (repository root)

```text
src/
├── components/
│   └── ui/
│       └── SearchSection/
│           ├── index.ts                    # Named exports
│           ├── SearchSection.tsx           # Component implementation
│           ├── SearchSection.types.ts      # TypeScript interfaces (data-model)
│           ├── SearchSection.stories.tsx   # Storybook stories
│           └── SearchSection.test.tsx      # Unit + integration tests
├── styles/
│   ├── tokens.css                          # Layer 1 + Layer 2 semantic tokens
│   └── themes/
│       └── violet.css                      # Brand variant overrides (light + dark)
└── lib/
    └── utils.ts                            # cn() utility for class merging
```

**Structure Decision**: Single-component flat pattern. SearchSection renders search input, filter tabs (via Radix Tabs), and result count as unified layout. No sub-component exports. Styling uses semantic tokens from `src/styles/tokens.css` and Tailwind utilities mapped in `src/index.css`.

## Complexity Tracking

No Constitution violations. All patterns comply with Aurora design system rules.
