# Aurora Design System — Agent Instructions

React 19 + TypeScript 6 component library. Design tokens → Tailwind utilities → components.

## Read First

**`.specify/memory/constitution.md`** is the authoritative source of truth. Read it before implementing or suggesting any component code. It supersedes everything in this file.

## Non-Negotiable Rules

1. **Semantic tokens only** — no hex/rgb, no `bg-[#fff]`, no inline `style` props. Use Tailwind utilities mapped to CSS custom properties (`bg-surface`, `text-ink`, `border-accent`). Tokens defined in `src/styles/tokens.css`.
2. **Component API** — every component (including compound sub-components) must have `forwardRef`, `className` merged via `cn()` from `src/lib/utils.ts`, and `displayName` explicitly set.
3. **Flat vs compound** — simple components (Button, Input, Badge) are a single named export. Complex ones (Tabs, Dialog, Select) use `Object.assign(Root, { Sub })`.
4. **Radix UI for accessibility** — use Radix primitives for interactive components managing focus, keyboard nav, or ARIA state. Do not reimplement what Radix handles.
5. **Pure-CSS theming** — `data-theme="dark"` on `:root` toggles dark mode. No JS theme switching.

## Component Requirements

Every component lives at `src/components/ui/ComponentName/` and must have exactly 5 files:

```
index.ts
ComponentName.tsx
ComponentName.types.ts
ComponentName.stories.tsx
ComponentName.test.tsx
```

A component is not shippable until all 5 exist and all quality gates in the constitution pass.

## Installed Radix Packages

Only these three are available — do not import others:

```
@radix-ui/react-slot    ← asChild pattern
@radix-ui/react-tabs    ← Tabs compound component
@radix-ui/react-dialog  ← Dialog/Modal compound component
```

## Path Alias

`@` → `src/` (e.g. `import { cn } from "@/lib/utils"`)

## Forbidden Patterns

- Hard-coded hex/rgb/hsl values anywhere in component files
- Arbitrary Tailwind bracket notation for design properties (`bg-[#fff]`, `p-[6px]`)
- Inline `style` props for color, spacing, or typography
- Direct references to Layer 1 primitive tokens (`--rust-500`) — use Layer 2 semantics only
- Default exports — all exports must be named
- Missing `forwardRef` on any component or compound sub-component

## Spec Kit Workflow

This repo uses Spec Kit for AI-driven feature development. The workflow is:

```
/speckit.specify → /speckit.plan → /speckit.tasks → /speckit.implement
```

Agents and prompts live in `.github/agents/` and `.github/prompts/`. The active feature directory is tracked in `.specify/feature.json`. Git lifecycle hooks are defined in `.specify/extensions.yml`.

## Commands

```bash
npm run dev        # Vite dev server
npm run storybook  # Storybook component explorer
npm test           # Vitest browser tests
npm run build      # Production build
```
