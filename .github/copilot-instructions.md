# Aurora Design System — Copilot Instructions

React 19 + TypeScript 6 + Tailwind 4 component library with a strict design system constitution.

> These instructions apply to all Copilot interactions. For agent-mode implementation behaviour, see `AGENTS.md`.

## Source of Truth

**`.specify/memory/constitution.md`** — read it before implementing or suggesting any component code. It supersedes everything else.

## Non-Negotiable Rules

1. **Semantic tokens only** — no hex/rgb/hsl values, no arbitrary Tailwind (`bg-[#fff]`, `p-[6px]`), no inline `style` props for design properties. Use Tailwind utilities mapped to CSS custom properties (`bg-surface`, `text-ink`, `border-accent`). Tokens defined in `src/styles/tokens.css`, exposed as utilities in `src/index.css`.

2. **Component API contract** — every component (including compound sub-components) must have:
   - `forwardRef` wrapper
   - `className` prop merged last via `cn()` from `src/lib/utils.ts`
   - `displayName` explicitly set

3. **Flat vs compound pattern** — simple components (Button, Input, Badge) are a single export. Complex components (Tabs, Dialog, Select) use the compound pattern: `Object.assign(Root, { List, Trigger, Content })`.

4. **Radix UI for accessibility** — use Radix primitives for all interactive components that manage focus, keyboard navigation, or ARIA state. Do not reimplement what Radix handles.

5. **Pure-CSS theming** — `data-theme="dark"` on `:root` toggles dark mode. No JavaScript theme switching.

6. **Named exports only** — no default exports anywhere.

## Installed Radix Packages

Only these are available — do not suggest or import others:

```
@radix-ui/react-slot    ← asChild pattern
@radix-ui/react-tabs    ← Tabs compound component
@radix-ui/react-dialog  ← Dialog/Modal compound component
```

## Component File Requirements

Every component must have exactly 5 files under `src/components/ui/ComponentName/`:

```
index.ts              ← named re-exports only, no side effects
ComponentName.tsx
ComponentName.types.ts
ComponentName.stories.tsx
ComponentName.test.tsx
```

## Path Alias

`@` → `src/` (e.g. `import { cn } from "@/lib/utils"`)

## Forbidden Patterns

- Hard-coded hex/rgb/hsl values anywhere in component code
- Arbitrary Tailwind bracket notation for design properties (`bg-[#fff]`, `p-[6px]`)
- Inline `style` props for color, spacing, or typography
- Direct references to Layer 1 primitive tokens (`--rust-500`) — use Layer 2 semantics only
- Default exports
- Missing `forwardRef` on any component or compound sub-component
- Inventing token names — if a token doesn't exist in `src/styles/tokens.css`, flag it; never make one up
