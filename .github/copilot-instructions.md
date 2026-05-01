# Aurora Design System — Copilot Instructions

React 19 + TypeScript 6 + Tailwind 4 component library with a strict design system constitution.

## Source of Truth

**`.specify/memory/constitution.md`** — read it before implementing or suggesting any component code. It supersedes all other patterns.

## Five Non-Negotiable Rules

1. **Semantic tokens only** — no hex/rgb/hsl values, no arbitrary Tailwind (`bg-[#fff]`, `p-[6px]`), no inline `style` props for design properties. Use Tailwind utilities that map to CSS custom properties (e.g. `bg-surface`, `text-ink`, `border-accent`). Tokens are defined in `src/styles/tokens.css`.

2. **Component API contract** — every component (including compound sub-components) must have:
   - `forwardRef` wrapper
   - `className` prop merged last via `cn()` from `src/lib/utils.ts`
   - `displayName` explicitly set

3. **Flat vs compound pattern** — simple components (Button, Input, Badge) are a single export. Complex components (Tabs, Dialog, Select) use the compound pattern: `Object.assign(Root, { List, Trigger, Content })`.

4. **Radix UI for accessibility** — use Radix primitives for all interactive components that manage focus, keyboard navigation, or ARIA state. Do not reimplement what Radix handles.

5. **Pure-CSS theming** — `data-theme="dark"` on `:root` toggles dark mode. Brand variants override semantic tokens in CSS. No JavaScript theme switching.

## Component File Requirements

Every component must have exactly 5 files under `src/components/ui/ComponentName/`:

```
index.ts
ComponentName.tsx
ComponentName.types.ts
ComponentName.stories.tsx
ComponentName.test.tsx
```

## Forbidden Patterns

- Hard-coded color values anywhere in component code
- `bg-[#hex]`, `text-[#hex]`, or any arbitrary Tailwind bracket notation for design properties
- `style={{ color: ..., padding: ... }}` inline props
- Direct references to Layer 1 primitive tokens (e.g. `--rust-500`) — use Layer 2 semantics only
- Default exports (all exports must be named)
- Missing `forwardRef` on any component, including compound sub-components
