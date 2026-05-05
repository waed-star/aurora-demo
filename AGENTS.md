# Aurora Design System — Agent Instructions

React 19 + TypeScript 6 component library. Design tokens → Tailwind utilities → components.

## Orient Before Anything Else

Run these before writing a single line of code:

```bash
cat .specify/feature.json          # active feature spec directory
cat .specify/memory/constitution.md # authoritative design rules — supersedes this file
ls specs/                          # all feature specs (past and current)
ls src/components/ui/              # components already shipped
```

The active feature's spec is at `specs/<feature-directory>/`. Always read `spec.md`, `plan.md`, and `checklists/requirements.md` before implementing.

## Non-Negotiable Rules

1. **Semantic tokens only** — no hex/rgb, no `bg-[#fff]`, no inline `style` props. Use Tailwind utilities mapped to CSS custom properties (`bg-surface`, `text-ink`, `border-accent`). Tokens defined in `src/styles/tokens.css`, exposed as Tailwind utilities in `src/index.css`.
2. **Component API** — every component (including compound sub-components) must have `forwardRef`, `className` merged via `cn()` from `src/lib/utils.ts`, and `displayName` explicitly set.
3. **Flat vs compound** — simple components (Button, Input, Badge) are a single named export. Complex ones (Tabs, Dialog, Select) use `Object.assign(Root, { Sub })`.
4. **Radix UI for accessibility** — use Radix primitives for interactive components managing focus, keyboard nav, or ARIA state. Do not reimplement what Radix handles.
5. **Pure-CSS theming** — `data-theme="dark"` on `:root` toggles dark mode. No JS theme switching.
6. **Named exports only** — no default exports anywhere. Every export must be named.

## Component Requirements

Every component lives at `src/components/ui/ComponentName/` and must have exactly 5 files:

```
index.ts             ← named re-exports only, no side effects
ComponentName.tsx    ← implementation
ComponentName.types.ts
ComponentName.stories.tsx
ComponentName.test.tsx
```

A component is not shippable until all 5 exist and all quality gates in the constitution pass.

## Installed Radix Packages

Only these are available — do not import others without checking `package.json` first:

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
- Default exports
- Missing `forwardRef` on any component or compound sub-component
- Inventing token names — if a required token doesn't exist in `src/styles/tokens.css`, flag it; never make one up

## Spec Kit Workflow

This repo uses **spec-driven development**. Features are not implemented until they have a spec. The workflow is always:

```
/speckit.specify   → produces specs/<feature>/spec.md + checklists/requirements.md
/speckit.plan      → produces specs/<feature>/plan.md
/speckit.tasks     → produces specs/<feature>/data-model.md + task breakdown
/speckit.implement → implements against the spec, one task at a time
```

**Never skip steps.** If a spec file is missing, run the corresponding Spec Kit command rather than implementing ad-hoc.

- Agent and prompt definitions: `.github/agents/` and `.github/prompts/`
- Active feature: `.specify/feature.json`
- Git lifecycle extensions: `.specify/extensions.yml`

When implementing, check `checklists/requirements.md` and tick off requirements as they are satisfied. A task is done when its checklist item is complete and tests pass.

## Commands

```bash
npm run dev        # Vite dev server (App.tsx sandbox)
npm run storybook  # Storybook component explorer
npm test           # Vitest browser tests
npm run build      # Production build
```
